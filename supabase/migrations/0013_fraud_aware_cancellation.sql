-- FastGo schema — 0013: replace the naive "every cancellation is a strike"
-- system from 0012 with GPS-evidence-based fraud detection.
--
-- The point was never to punish drivers for cancelling — legitimate
-- cancellations (no-show, safety concern, wrong pickup) must never cost a
-- partner anything. The actual fraud pattern: a partner cancels in-app to
-- dodge the platform fee, then completes the physical trip anyway for cash.
-- trip_locations already records GPS breadcrumbs; if a "cancelled" trip's
-- GPS keeps moving toward the real dropoff after the cancellation, that's
-- strong evidence the trip happened regardless. This is a rule-based
-- scoring engine — the practical foundation real trust & safety systems
-- build on before layering true ML on top, not a claim of one.

alter table trips
  add column fraud_score numeric,
  add column suspected_fraud boolean not null default false,
  add column fraud_evaluated_at timestamptz;

comment on column trips.suspected_fraud is
  'Set by evaluate_cancellation_fraud(), never by cancel_trip() itself — the GPS evidence this depends on only exists after the grace period has passed. Only suspected_fraud = true counts toward the cancellation strike system.';

-- ---------------------------------------------------------------------
-- scoring: 0-100, weighted GPS + timing signals
-- ---------------------------------------------------------------------
create function compute_cancellation_fraud_score(p_trip_id uuid) returns numeric as $$
declare
  v_trip trips;
  v_score numeric := 0;
  v_moved_toward_dropoff boolean;
  v_reached_pickup_after_cancel boolean;
  v_fast_cancel boolean;
begin
  select * into v_trip from trips where id = p_trip_id;
  if v_trip is null or v_trip.status <> 'cancelled' or v_trip.cancelled_by <> v_trip.partner_id then
    return 0; -- only partner-initiated cancellations are ever evaluated
  end if;

  -- Signal 1 (heaviest): GPS recorded AFTER the cancellation still shows
  -- the vehicle reaching the real dropoff — the strongest evidence the
  -- trip was completed off-platform specifically to dodge the fee.
  select exists (
    select 1 from trip_locations
    where trip_id = p_trip_id
      and recorded_at > v_trip.cancelled_at
      and st_dwithin(location, v_trip.dropoff_location, 300)
  ) into v_moved_toward_dropoff;

  -- Signal 2: cancelled before pickup, but GPS afterward shows arrival at
  -- the pickup point anyway — suggests the passenger was collected despite
  -- the in-app cancellation.
  select exists (
    select 1 from trip_locations
    where trip_id = p_trip_id
      and recorded_at > v_trip.cancelled_at
      and st_dwithin(location, v_trip.pickup_location, 150)
  ) into v_reached_pickup_after_cancel;

  -- Signal 3 (context only, never scored alone): cancelling within 60s of
  -- match reads as "saw the fare, cancelled instantly" — only meaningful
  -- when paired with a GPS signal above; a fast, clean cancellation with
  -- no further movement is just a fast legitimate cancellation.
  v_fast_cancel := v_trip.cancelled_at - v_trip.created_at < interval '60 seconds';

  if v_moved_toward_dropoff then
    v_score := v_score + 70;
  end if;
  if v_reached_pickup_after_cancel then
    v_score := v_score + 20;
  end if;
  if v_fast_cancel and (v_moved_toward_dropoff or v_reached_pickup_after_cancel) then
    v_score := v_score + 10;
  end if;

  return least(v_score, 100);
end;
$$ language plpgsql security definer stable;

comment on function compute_cancellation_fraud_score is
  'score >= fraud_score_threshold() (60) => suspected_fraud. Tunable alongside cancellation_strike_threshold()/window() in 0012 — same single-source-of-truth pattern.';

create function fraud_score_threshold() returns numeric as $$
  select 60;
$$ language sql immutable;

-- ---------------------------------------------------------------------
-- scheduled evaluator: GPS evidence only exists some time after
-- cancellation, so this can't run inside cancel_trip() itself.
-- ---------------------------------------------------------------------
create function evaluate_cancellation_fraud(p_grace_minutes integer default 10) returns void as $$
declare
  rec record;
  v_score numeric;
  v_strikes integer;
begin
  perform set_config('fastgo.trusted_status_change', 'true', true);

  for rec in
    select * from trips
    where status = 'cancelled'
      and cancelled_by = partner_id
      and fraud_evaluated_at is null
      and cancelled_at <= now() - (p_grace_minutes || ' minutes')::interval
  loop
    v_score := compute_cancellation_fraud_score(rec.id);

    update trips set
      fraud_score = v_score,
      suspected_fraud = v_score >= fraud_score_threshold(),
      fraud_evaluated_at = now()
    where id = rec.id;

    if v_score >= fraud_score_threshold() then
      insert into compliance_events (partner_id, event_type, details)
      values (
        rec.partner_id, 'manual_review',
        jsonb_build_object(
          'reason', 'suspected_cancellation_fraud',
          'trip_id', rec.id,
          'fraud_score', v_score,
          'signal', 'gps_shows_trip_likely_completed_after_cancellation'
        )
      );

      v_strikes := count_recent_partner_cancellations(rec.partner_id);
      if v_strikes >= cancellation_strike_threshold() then
        update partners set status = 'suspended' where id = rec.partner_id and status = 'active';
        insert into compliance_events (partner_id, event_type, details)
        values (
          rec.partner_id, 'partner_suspended',
          jsonb_build_object(
            'reason', 'excessive_fraudulent_cancellations',
            'strikes_in_window', v_strikes,
            'window_days', extract(day from cancellation_strike_window()),
            'next_step', 'Contact FastGo support to review and request reinstatement'
          )
        );
      end if;
    end if;
  end loop;
end;
$$ language plpgsql security definer set search_path = public;

do $$
begin
  perform cron.schedule('fastgo-evaluate-cancellation-fraud', '*/10 * * * *', 'select evaluate_cancellation_fraud()');
exception when others then
  raise notice 'pg_cron unavailable — schedule evaluate_cancellation_fraud() externally (e.g. an Edge Function on a cron trigger)';
end $$;

-- ---------------------------------------------------------------------
-- only fraud-flagged cancellations count as strikes now (was: every one)
-- ---------------------------------------------------------------------
create or replace function count_recent_partner_cancellations(p_partner_id uuid) returns integer as $$
  select count(*)::integer
  from trips
  where partner_id = p_partner_id
    and status = 'cancelled'
    and cancelled_by = p_partner_id
    and suspected_fraud = true
    and cancelled_at >= now() - cancellation_strike_window();
$$ language sql stable;

comment on function count_recent_partner_cancellations is
  'Counts only cancellations evaluate_cancellation_fraud() flagged as suspected_fraud — never a plain cancellation count. A partner can cancel legitimately as often as needed without risk.';

-- ---------------------------------------------------------------------
-- cancel_trip(): drop the old naive immediate-strike logic; still logs a
-- baseline audit event for every partner cancellation (visibility, not
-- punishment) and always requires a reason.
-- ---------------------------------------------------------------------
create or replace function cancel_trip(p_trip_id uuid, p_reason text default null) returns void as $$
declare
  v_trip trips;
begin
  select * into v_trip from trips where id = p_trip_id for update;
  if v_trip is null or (v_trip.passenger_id <> auth.uid() and v_trip.partner_id <> auth.uid()) then
    raise exception 'trip not found or not yours';
  end if;
  if v_trip.status in ('completed', 'cancelled') then
    raise exception 'trip already finished';
  end if;
  if auth.uid() = v_trip.partner_id and p_reason is null then
    raise exception 'a cancellation reason is required from partners';
  end if;

  update trips set
    status = 'cancelled',
    cancelled_at = now(),
    cancelled_by = auth.uid(),
    cancellation_reason = p_reason
  where id = p_trip_id;
  update ride_requests set status = 'cancelled' where id = v_trip.request_id;

  if auth.uid() = v_trip.partner_id then
    insert into compliance_events (partner_id, event_type, details)
    values (
      v_trip.partner_id,
      'manual_review',
      jsonb_build_object(
        'reason', 'partner_cancelled_trip',
        'trip_id', p_trip_id,
        'cancellation_reason', p_reason,
        'note', 'GPS-based fraud evaluation runs automatically after a grace period — this entry alone is not a strike'
      )
    );
  end if;
end;
$$ language plpgsql security definer;
