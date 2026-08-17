-- FastGo schema — 0007: functions, triggers, views
--
-- Ledger- and status-changing operations (accepting an offer, starting or
-- completing a trip, suspending a partner) go through SECURITY DEFINER
-- functions rather than open client UPDATEs. This is what makes the
-- compliance trail and wallet ledger trustworthy: a partner cannot
-- self-reinstate, a passenger cannot rewrite a fare after the fact.

-- ---------------------------------------------------------------------
-- generic updated_at trigger
-- ---------------------------------------------------------------------
create function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_set_updated_at before update on profiles
  for each row execute function set_updated_at();
create trigger partners_set_updated_at before update on partners
  for each row execute function set_updated_at();
create trigger council_rules_set_updated_at before update on council_rules
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------
-- new-user provisioning: auth.users row -> profiles + wallet
-- ---------------------------------------------------------------------
create function handle_new_user() returns trigger as $$
begin
  insert into profiles (id, phone, full_name)
  values (
    new.id,
    coalesce(new.phone, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', 'FastGo User')
  );
  insert into wallets (owner_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------------
-- document / partner compliance
-- ---------------------------------------------------------------------
create function compute_document_status(expires_at date) returns document_status as $$
  select case
    when expires_at < current_date then 'expired'::document_status
    when expires_at <= current_date + interval '30 days' then 'expiring_soon'::document_status
    else 'valid'::document_status
  end;
$$ language sql immutable;

create view partner_documents_status as
  select pd.*, compute_document_status(pd.expires_at) as status
  from partner_documents pd;

create view partner_compliance as
  select
    p.id as partner_id,
    p.status as partner_status,
    bool_or(compute_document_status(pd.expires_at) = 'expired') as has_expired_document,
    bool_or(compute_document_status(pd.expires_at) = 'expiring_soon') as has_expiring_document
  from partners p
  left join partner_documents pd on pd.partner_id = p.id
  group by p.id, p.status;

comment on view partner_compliance is
  'One row per partner summarizing document health. Drives fastgo automatic suspend/reinstate — this is the "compliance is a technical capability, not a filed document" requirement from the FastGo brief.';

-- Prevent partners from editing their own status column directly; only a
-- service-role caller (the compliance sync job / an ops action) may.
create function prevent_partner_self_status_change() returns trigger as $$
begin
  if new.status is distinct from old.status and auth.role() <> 'service_role' then
    raise exception 'partner status can only be changed by the FastGo compliance engine';
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger partners_guard_status_change
  before update on partners
  for each row execute function prevent_partner_self_status_change();

-- Walks every partner's document compliance and reconciles partners.status
-- + compliance_events. Intended to run on a schedule (pg_cron below) and/or
-- be invoked after a document is verified or edited.
create function sync_partner_compliance() returns void as $$
declare
  rec record;
begin
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

-- Best-effort nightly schedule; harmless no-op if pg_cron isn't available
-- in this environment (e.g. some hosted/local setups).
do $$
begin
  create extension if not exists pg_cron;
  perform cron.schedule('fastgo-sync-partner-compliance', '0 3 * * *', 'select sync_partner_compliance()');
exception when others then
  raise notice 'pg_cron unavailable — schedule sync_partner_compliance() externally (e.g. an Edge Function on a cron trigger)';
end $$;

-- ---------------------------------------------------------------------
-- trip participant guard + safe counterpart lookup
-- ---------------------------------------------------------------------
create function is_trip_participant(p_trip_id uuid) returns boolean as $$
  select exists (
    select 1 from trips
    where id = p_trip_id
      and (passenger_id = auth.uid() or partner_id = auth.uid())
  );
$$ language sql security definer stable;

-- Returns only the safe, display-relevant fields of the other party on a
-- trip — never the full profile/documents row — and only to a participant.
create function get_matched_counterpart(p_trip_id uuid) returns table (
  full_name text,
  avatar_url text,
  rating_avg numeric,
  vehicle_make text,
  vehicle_model text,
  vehicle_colour text,
  vehicle_plate text
) as $$
  select
    prof.full_name,
    prof.avatar_url,
    prof.rating_avg,
    v.make,
    v.model,
    v.colour,
    v.plate
  from trips t
  join profiles prof on prof.id = case when t.passenger_id = auth.uid() then t.partner_id else t.passenger_id end
  left join vehicles v on v.id = t.vehicle_id
  where t.id = p_trip_id and is_trip_participant(p_trip_id);
$$ language sql security definer stable;

-- ---------------------------------------------------------------------
-- matching: nearby open requests for an active partner (never a raw table scan)
-- ---------------------------------------------------------------------
create function find_nearby_open_requests(p_radius_m integer default 4000) returns table (
  request_id uuid,
  pickup_address text,
  dropoff_address text,
  suggested_fare numeric,
  vehicle_class text,
  distance_m numeric
) as $$
  select
    r.id,
    r.pickup_address,
    r.dropoff_address,
    r.suggested_fare,
    r.vehicle_class,
    st_distance(r.pickup_location, v.last_known_location) as distance_m
  from ride_requests r
  cross join lateral (
    select location as last_known_location
    from trip_locations tl
    join trips t on t.id = tl.trip_id
    where t.partner_id = auth.uid()
    order by tl.recorded_at desc
    limit 1
  ) v
  where r.status = 'searching'
    and exists (select 1 from partners where id = auth.uid() and status = 'active')
    and st_dwithin(r.pickup_location, v.last_known_location, p_radius_m)
  order by distance_m asc
  limit 20;
$$ language sql security definer stable;

comment on function find_nearby_open_requests is
  'Partners never SELECT ride_requests directly (that would leak every passenger''s pickup location to every partner) — they call this instead, which only returns nearby open requests to an active, verified partner.';

-- ---------------------------------------------------------------------
-- negotiation: accepting an offer atomically creates the trip
-- ---------------------------------------------------------------------
create function accept_ride_offer(p_offer_id uuid) returns uuid as $$
declare
  v_offer ride_offers;
  v_request ride_requests;
  v_vehicle_id uuid;
  v_trip_id uuid;
begin
  select * into v_offer from ride_offers where id = p_offer_id for update;
  if v_offer is null then
    raise exception 'offer not found';
  end if;

  select * into v_request from ride_requests where id = v_offer.request_id for update;
  if v_request.passenger_id <> auth.uid() then
    raise exception 'only the requesting passenger may accept an offer';
  end if;
  if v_request.status <> 'searching' then
    raise exception 'this request is no longer open';
  end if;

  select id into v_vehicle_id from vehicles
    where partner_id = v_offer.partner_id and is_active = true
    order by created_at desc limit 1;

  update ride_offers set status = 'accepted', responded_at = now() where id = p_offer_id;
  update ride_offers set status = 'declined', responded_at = now()
    where request_id = v_offer.request_id and id <> p_offer_id and status = 'pending';
  update ride_requests set status = 'matched' where id = v_request.id;

  insert into trips (
    request_id, offer_id, passenger_id, partner_id, vehicle_id,
    agreed_fare, status, pickup_location, dropoff_location
  ) values (
    v_request.id, v_offer.id, v_request.passenger_id, v_offer.partner_id, v_vehicle_id,
    v_offer.offered_fare, 'matched', v_request.pickup_location, v_request.dropoff_location
  ) returning id into v_trip_id;

  return v_trip_id;
end;
$$ language plpgsql security definer;

-- ---------------------------------------------------------------------
-- trip lifecycle + wallet settlement
-- ---------------------------------------------------------------------
create function start_trip(p_trip_id uuid) returns void as $$
begin
  update trips set status = 'in_progress', started_at = now()
  where id = p_trip_id and partner_id = auth.uid() and status in ('matched', 'enroute_pickup');
  if not found then
    raise exception 'trip not found, not yours, or not startable from its current status';
  end if;
end;
$$ language plpgsql security definer;

create function complete_trip(
  p_trip_id uuid,
  p_distance_km numeric,
  p_duration_min numeric,
  p_platform_service_fee_pct numeric default 0.20
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
  values (v_partner_wallet, 'platform_service_fee', -v_service_fee, p_trip_id, 'FastGo platform service fee (20%)');

  update wallets set balance = balance + v_trip.agreed_fare - v_service_fee, updated_at = now()
  where id = v_partner_wallet;

  update partners set total_trips = total_trips + 1 where id = v_trip.partner_id;
end;
$$ language plpgsql security definer;

create function cancel_trip(p_trip_id uuid, p_reason text default null) returns void as $$
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

  update trips set status = 'cancelled', cancelled_at = now(), cancelled_by = auth.uid()
  where id = p_trip_id;
  update ride_requests set status = 'cancelled' where id = v_trip.request_id;
end;
$$ language plpgsql security definer;

-- ---------------------------------------------------------------------
-- safety: a low rating opens a manual review, never an automatic ban
-- ---------------------------------------------------------------------
create function flag_low_rating() returns trigger as $$
begin
  if new.stars <= 2 and exists (select 1 from partners where id = new.ratee_id) then
    insert into compliance_events (partner_id, event_type, details)
    values (
      new.ratee_id,
      'manual_review',
      jsonb_build_object('reason', 'low_rating', 'trip_id', new.trip_id, 'stars', new.stars)
    );
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger ratings_flag_low_rating
  after insert on ratings
  for each row execute function flag_low_rating();

-- keep profiles.rating_avg/rating_count in sync
create function refresh_profile_rating() returns trigger as $$
begin
  update profiles set
    rating_avg = (select round(avg(stars)::numeric, 2) from ratings where ratee_id = new.ratee_id),
    rating_count = (select count(*) from ratings where ratee_id = new.ratee_id)
  where id = new.ratee_id;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger ratings_refresh_profile_rating
  after insert on ratings
  for each row execute function refresh_profile_rating();
