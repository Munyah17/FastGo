-- FastGo schema — 0012: correct platform fee to 15%, cancellation-fraud
-- prevention (partners cancelling right after match to dodge the service
-- fee), and a trusted-writer escape hatch for the partner-status guard.
--
-- Internal/commercial detail — not for public-facing product copy: the
-- platform service fee is 15% of the agreed fare, deducted from the
-- partner's payout on trip completion (see complete_trip() below).

-- ---------------------------------------------------------------------
-- trusted-writer escape hatch
-- ---------------------------------------------------------------------
-- prevent_partner_self_status_change() (0007_functions.sql) only allowed
-- auth.role() = 'service_role' to change partners.status. But
-- SECURITY DEFINER does not change auth.role() — that GUC reflects the
-- original caller's session, not the function owner — so a normal partner
-- calling cancel_trip() below would be blocked from having their own
-- account correctly suspended by that same trusted function. Trusted
-- FastGo functions now set a transaction-local flag before writing
-- partners.status; the trigger accepts either that flag or service_role.
-- A raw client UPDATE still can't set the flag, so direct writes stay blocked.
create or replace function prevent_partner_self_status_change() returns trigger as $$
begin
  if new.status is distinct from old.status
     and auth.role() <> 'service_role'
     and coalesce(current_setting('fastgo.trusted_status_change', true), 'false') <> 'true' then
    raise exception 'partner status can only be changed by the FastGo compliance engine';
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- ---------------------------------------------------------------------
-- tunable strike parameters (single source of truth, not magic numbers)
-- ---------------------------------------------------------------------
create function cancellation_strike_threshold() returns integer as $$
  select 3;
$$ language sql immutable;

create function cancellation_strike_window() returns interval as $$
  select interval '7 days';
$$ language sql immutable;

-- ---------------------------------------------------------------------
-- partner-initiated cancellation tracking
-- ---------------------------------------------------------------------
alter table trips add column cancellation_reason text;

comment on column trips.cancellation_reason is
  'Free-text reason captured from whoever cancelled. Required from partners in the UI so recurring "changed my mind after seeing the fare" patterns are visible, not just the raw count.';

create function count_recent_partner_cancellations(p_partner_id uuid) returns integer as $$
  select count(*)::integer
  from trips
  where partner_id = p_partner_id
    and status = 'cancelled'
    and cancelled_by = p_partner_id
    and cancelled_at >= now() - cancellation_strike_window();
$$ language sql stable;

comment on function count_recent_partner_cancellations is
  'Counts trips THIS partner cancelled (any stage after match — matched/enroute_pickup/in_progress) in the trailing window. Passenger-initiated cancellations never count against a partner — see cancel_trip().';

-- ---------------------------------------------------------------------
-- cancel_trip(): now enforces the strike system when the partner cancels
-- ---------------------------------------------------------------------
create or replace function cancel_trip(p_trip_id uuid, p_reason text default null) returns void as $$
declare
  v_trip trips;
  v_strikes integer;
begin
  select * into v_trip from trips where id = p_trip_id for update;
  if v_trip is null or (v_trip.passenger_id <> auth.uid() and v_trip.partner_id <> auth.uid()) then
    raise exception 'trip not found or not yours';
  end if;
  if v_trip.status in ('completed', 'cancelled') then
    raise exception 'trip already finished';
  end if;

  update trips set
    status = 'cancelled',
    cancelled_at = now(),
    cancelled_by = auth.uid(),
    cancellation_reason = p_reason
  where id = p_trip_id;
  update ride_requests set status = 'cancelled' where id = v_trip.request_id;

  -- Only the partner's own cancellations are a fee-evasion signal.
  if auth.uid() = v_trip.partner_id then
    v_strikes := count_recent_partner_cancellations(v_trip.partner_id);

    insert into compliance_events (partner_id, event_type, details)
    values (
      v_trip.partner_id,
      'manual_review',
      jsonb_build_object(
        'reason', 'partner_cancelled_trip',
        'trip_id', p_trip_id,
        'cancellation_reason', p_reason,
        'strikes_in_window', v_strikes,
        'window_days', extract(day from cancellation_strike_window())
      )
    );

    if v_strikes >= cancellation_strike_threshold() then
      perform set_config('fastgo.trusted_status_change', 'true', true);
      update partners set status = 'suspended' where id = v_trip.partner_id and status = 'active';

      insert into compliance_events (partner_id, event_type, details)
      values (
        v_trip.partner_id,
        'partner_suspended',
        jsonb_build_object(
          'reason', 'excessive_cancellations',
          'strikes_in_window', v_strikes,
          'window_days', extract(day from cancellation_strike_window()),
          'next_step', 'Contact FastGo support to review and request reinstatement'
        )
      );
    end if;
  end if;
end;
$$ language plpgsql security definer;

-- ---------------------------------------------------------------------
-- complete_trip(): correct the platform service fee default to 15%
-- ---------------------------------------------------------------------
create or replace function complete_trip(
  p_trip_id uuid,
  p_distance_km numeric,
  p_duration_min numeric,
  p_platform_service_fee_pct numeric default 0.15
) returns void as $$
declare
  v_trip trips;
  v_service_fee numeric;
  v_partner_wallet uuid;
begin
  select * into v_trip from trips where id = p_trip_id for update;
  if v_trip is null or v_trip.partner_id <> auth.uid() then
    raise exception 'trip not found or not yours';
  end if;
  if v_trip.status <> 'in_progress' then
    raise exception 'trip is not in progress';
  end if;

  v_service_fee := round(v_trip.agreed_fare * p_platform_service_fee_pct, 2);

  update trips set
    status = 'completed',
    completed_at = now(),
    distance_km = p_distance_km,
    duration_min = p_duration_min
  where id = p_trip_id;

  insert into fares (trip_id, base_fare, platform_service_fee, total_fare)
  values (p_trip_id, v_trip.agreed_fare, v_service_fee, v_trip.agreed_fare);

  select id into v_partner_wallet from wallets where owner_id = v_trip.partner_id;

  insert into wallet_transactions (wallet_id, type, amount, related_trip_id, description)
  values (v_partner_wallet, 'trip_earning', v_trip.agreed_fare, p_trip_id, 'Trip earnings');
  insert into wallet_transactions (wallet_id, type, amount, related_trip_id, description)
  values (
    v_partner_wallet, 'platform_service_fee', -v_service_fee, p_trip_id,
    format('FastGo platform service fee (%s%%)', round(p_platform_service_fee_pct * 100))
  );

  update wallets set balance = balance + v_trip.agreed_fare - v_service_fee, updated_at = now()
  where id = v_partner_wallet;

  update partners set total_trips = total_trips + 1 where id = v_trip.partner_id;
end;
$$ language plpgsql security definer;

-- ---------------------------------------------------------------------
-- sync_partner_compliance(): also route its status writes through the
-- trusted flag now that the guard checks for it explicitly, so behavior
-- stays correct even when this is invoked by something other than a
-- true service_role session (e.g. a scheduled Edge Function using a
-- user-context client by mistake).
-- ---------------------------------------------------------------------
create or replace function sync_partner_compliance() returns void as $$
declare
  rec record;
begin
  perform set_config('fastgo.trusted_status_change', 'true', true);
  for rec in select * from partner_compliance loop
    if rec.has_expired_document and rec.partner_status = 'active' then
      update partners set status = 'suspended' where id = rec.partner_id;
      insert into compliance_events (partner_id, event_type, details)
        values (rec.partner_id, 'partner_suspended', jsonb_build_object('reason', 'document_expired'));
    elsif not rec.has_expired_document and rec.partner_status = 'suspended' then
      update partners set status = 'active' where id = rec.partner_id;
      insert into compliance_events (partner_id, event_type, details)
        values (rec.partner_id, 'partner_reinstated', jsonb_build_object('reason', 'documents_renewed'));
    end if;
  end loop;
end;
$$ language plpgsql security definer set search_path = public;

grant execute on function
  count_recent_partner_cancellations(uuid),
  cancellation_strike_threshold(),
  cancellation_strike_window()
  to authenticated;
