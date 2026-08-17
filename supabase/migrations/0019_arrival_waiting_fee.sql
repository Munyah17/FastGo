-- FastGo schema — 0019: arrival handshake + waiting fee + dispute, and
-- declared extra-passenger/heavy-luggage fees.
--
-- The abuse pattern this guards against: a partner marking "arrived"
-- before actually being at the pickup point, to start the waiting-fee
-- clock dishonestly. Rather than trust the timestamp blindly, the
-- passenger can dispute it — a dispute always wins in this version (no
-- GPS-arbitration here, unlike the cancellation-fraud detector, because
-- unlike a cancellation there's no later GPS evidence to check arrival
-- against — the dispute IS the check). A passenger falsely disputing a
-- real arrival is a smaller, self-limiting problem: it just means their
-- driver won't get a waiting fee this one time, not a suspension-worthy
-- pattern the way fee-evading cancellations are.

alter table ride_requests
  add column extra_passengers smallint not null default 0,
  add column heavy_luggage boolean not null default false;

alter table ride_requests add constraint ride_requests_extra_passengers_range check (extra_passengers between 0 and 3);

comment on column ride_requests.extra_passengers is
  'Declared upfront by the passenger, not discovered by the partner mid-trip — see extra_passenger_fee(). Matches src/lib/data.ts EXTRA_PASSENGER_FEE.';

create function extra_passenger_fee() returns numeric as $$ select 0.50; $$ language sql immutable;
create function heavy_luggage_fee() returns numeric as $$ select 1.00; $$ language sql immutable;

alter table trips
  add column extra_passengers smallint not null default 0,
  add column heavy_luggage boolean not null default false,
  add column arrived_at timestamptz,
  add column waiting_fee numeric(10, 2) not null default 0,
  add column waiting_fee_disputed boolean not null default false,
  add column waiting_fee_dispute_reason text;

create function free_wait_minutes() returns integer as $$ select 3; $$ language sql immutable;
create function waiting_fee_per_min() returns numeric as $$ select 0.10; $$ language sql immutable;

-- accept_ride_offer(): carry the declared extras from the request onto the trip.
create or replace function accept_ride_offer(p_offer_id uuid, p_payment_method payment_method default 'wallet') returns uuid as $$
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
    agreed_fare, status, pickup_location, dropoff_location, payment_method,
    extra_passengers, heavy_luggage
  ) values (
    v_request.id, v_offer.id, v_request.passenger_id, v_offer.partner_id, v_vehicle_id,
    v_offer.offered_fare, 'matched', v_request.pickup_location, v_request.dropoff_location, p_payment_method,
    v_request.extra_passengers, v_request.heavy_luggage
  ) returning id into v_trip_id;

  return v_trip_id;
end;
$$ language plpgsql security definer;

-- ---------------------------------------------------------------------
-- arrival + waiting fee
-- ---------------------------------------------------------------------
create function mark_arrived(p_trip_id uuid) returns void as $$
begin
  update trips set arrived_at = now()
  where id = p_trip_id and partner_id = auth.uid() and status in ('matched', 'enroute_pickup') and arrived_at is null;
  if not found then
    raise exception 'trip not found, not yours, or already marked arrived';
  end if;
end;
$$ language plpgsql security definer;

create function dispute_waiting_fee(p_trip_id uuid, p_reason text) returns void as $$
begin
  if p_reason is null or length(trim(p_reason)) = 0 then
    raise exception 'a reason is required to dispute a waiting fee';
  end if;
  update trips set waiting_fee_disputed = true, waiting_fee_dispute_reason = p_reason, waiting_fee = 0
  where id = p_trip_id and passenger_id = auth.uid() and arrived_at is not null;
  if not found then
    raise exception 'trip not found, not yours, or no arrival to dispute';
  end if;
end;
$$ language plpgsql security definer;

comment on function dispute_waiting_fee is
  'The passenger''s dispute is authoritative — zeroes the fee immediately, no adjudication queue. See migration header for why that''s the right default here.';

-- start_trip(): locks in the waiting fee (if any, if undisputed) the
-- moment the ride actually starts, since that's when "how long did they
-- wait" stops being an open question.
create or replace function start_trip(p_trip_id uuid) returns void as $$
declare
  v_trip trips;
  v_wait_seconds integer;
begin
  select * into v_trip from trips where id = p_trip_id for update;
  if v_trip is null or v_trip.partner_id <> auth.uid() or v_trip.status not in ('matched', 'enroute_pickup') then
    raise exception 'trip not found, not yours, or not startable from its current status';
  end if;

  if v_trip.arrived_at is not null and not v_trip.waiting_fee_disputed then
    v_wait_seconds := extract(epoch from (now() - v_trip.arrived_at))::integer;
    if v_wait_seconds > free_wait_minutes() * 60 then
      update trips set waiting_fee = ceil((v_wait_seconds - free_wait_minutes() * 60) / 60.0) * waiting_fee_per_min()
      where id = p_trip_id;
    end if;
  end if;

  update trips set status = 'in_progress', started_at = now() where id = p_trip_id;
end;
$$ language plpgsql security definer;

-- complete_trip(): settle agreed_fare + extras + waiting_fee together.
create or replace function complete_trip(
  p_trip_id uuid,
  p_distance_km numeric,
  p_duration_min numeric,
  p_platform_service_fee_pct numeric default 0.15
) returns void as $$
declare
  v_trip trips;
  v_extras numeric;
  v_total_fare numeric;
  v_service_fee numeric;
  v_partner_wallet_id uuid;
  v_passenger_wallet_id uuid;
begin
  select * into v_trip from trips where id = p_trip_id for update;
  if v_trip is null or v_trip.partner_id <> auth.uid() then
    raise exception 'trip not found or not yours';
  end if;
  if v_trip.status <> 'in_progress' then
    raise exception 'trip is not in progress';
  end if;

  v_extras := v_trip.extra_passengers * extra_passenger_fee()
    + (case when v_trip.heavy_luggage then heavy_luggage_fee() else 0 end);
  v_total_fare := v_trip.agreed_fare + v_extras + v_trip.waiting_fee;
  v_service_fee := round(v_total_fare * p_platform_service_fee_pct, 2);

  update trips set
    status = 'completed',
    completed_at = now(),
    distance_km = p_distance_km,
    duration_min = p_duration_min
  where id = p_trip_id;

  insert into fares (trip_id, base_fare, platform_service_fee, total_fare)
  values (p_trip_id, v_total_fare, v_service_fee, v_total_fare);

  select id into v_partner_wallet_id from wallets where owner_id = v_trip.partner_id;
  perform apply_wallet_transaction(v_partner_wallet_id, 'trip_earning', v_total_fare, p_trip_id, 'Trip earnings (incl. extras/waiting fee)');
  perform apply_wallet_transaction(
    v_partner_wallet_id, 'platform_service_fee', -v_service_fee, p_trip_id,
    format('FastGo platform service fee (%s%%)', round(p_platform_service_fee_pct * 100))
  );

  if v_trip.payment_method = 'wallet' then
    select id into v_passenger_wallet_id from wallets where owner_id = v_trip.passenger_id;
    perform apply_wallet_transaction(v_passenger_wallet_id, 'ride_payment', -v_total_fare, p_trip_id, 'Ride payment (incl. extras/waiting fee)');
    insert into payments (trip_id, method, amount, status) values (p_trip_id, 'wallet', v_total_fare, 'completed');
  else
    insert into payments (trip_id, method, amount, status) values (p_trip_id, v_trip.payment_method, v_total_fare, 'completed');
  end if;

  update partners set total_trips = total_trips + 1 where id = v_trip.partner_id;
  perform refresh_passenger_credit_limit(v_trip.passenger_id);
  perform refresh_profile_tier(v_trip.passenger_id);
  perform refresh_profile_tier(v_trip.partner_id);
end;
$$ language plpgsql security definer;

revoke execute on function
  mark_arrived(uuid),
  dispute_waiting_fee(uuid, text),
  extra_passenger_fee(),
  heavy_luggage_fee(),
  free_wait_minutes(),
  waiting_fee_per_min()
  from public;

grant execute on function
  mark_arrived(uuid),
  dispute_waiting_fee(uuid, text),
  extra_passenger_fee(),
  heavy_luggage_fee(),
  free_wait_minutes(),
  waiting_fee_per_min()
  to authenticated;
