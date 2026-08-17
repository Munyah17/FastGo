-- FastGo schema — 0018: loyalty/trust tiers (Starter through Platinum).
--
-- Deliberately a blend of quantity (completed trips), quality (rating) AND
-- length (tenure) — mirrors src/lib/tier.ts on the client. A high trip
-- count with a mediocre rating, or a great rating with almost no history,
-- both cap out below the top tiers; you need all three dimensions moving
-- together.

create type profile_tier as enum ('Starter', 'Bronze', 'Silver', 'Gold', 'Diamond', 'Platinum');

alter table profiles add column tier profile_tier not null default 'Starter';

create function compute_profile_tier(p_profile_id uuid) returns profile_tier as $$
declare
  v_trips integer;
  v_rating numeric;
  v_tenure_months numeric;
begin
  select count(*) into v_trips from trips
    where (passenger_id = p_profile_id or partner_id = p_profile_id) and status = 'completed';

  select rating_avg, extract(epoch from (now() - created_at)) / 2629800
    into v_rating, v_tenure_months
    from profiles where id = p_profile_id;

  if v_trips >= 1500 and v_rating >= 4.8 and v_tenure_months >= 24 then return 'Platinum'; end if;
  if v_trips >= 700 and v_rating >= 4.7 and v_tenure_months >= 12 then return 'Diamond'; end if;
  if v_trips >= 300 and v_rating >= 4.5 and v_tenure_months >= 6 then return 'Gold'; end if;
  if v_trips >= 100 and v_rating >= 4.3 and v_tenure_months >= 3 then return 'Silver'; end if;
  if v_trips >= 20 and v_rating >= 4.0 then return 'Bronze'; end if;
  return 'Starter';
end;
$$ language plpgsql security definer stable;

comment on function compute_profile_tier is
  'Mirrors src/lib/tier.ts computeTier() on the client — keep thresholds in sync on either side.';

create function refresh_profile_tier(p_profile_id uuid) returns void as $$
begin
  update profiles set tier = compute_profile_tier(p_profile_id) where id = p_profile_id;
end;
$$ language plpgsql security definer set search_path = public;

-- A rating changes both rating_avg (already handled) and now tier.
create or replace function refresh_profile_rating() returns trigger as $$
begin
  update profiles set
    rating_avg = (select round(avg(stars)::numeric, 2) from ratings where ratee_id = new.ratee_id),
    rating_count = (select count(*) from ratings where ratee_id = new.ratee_id)
  where id = new.ratee_id;
  perform refresh_profile_tier(new.ratee_id);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Trip completion changes trip counts for both parties, so both tiers
-- may move — complete_trip() itself already increments partners.total_trips;
-- this just also recomputes tier for both passenger and partner.
create or replace function complete_trip(
  p_trip_id uuid,
  p_distance_km numeric,
  p_duration_min numeric,
  p_platform_service_fee_pct numeric default 0.15
) returns void as $$
declare
  v_trip trips;
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

  v_service_fee := round(v_trip.agreed_fare * p_platform_service_fee_pct, 2);

  update trips set
    status = 'completed',
    completed_at = now(),
    distance_km = p_distance_km,
    duration_min = p_duration_min
  where id = p_trip_id;

  insert into fares (trip_id, base_fare, platform_service_fee, total_fare)
  values (p_trip_id, v_trip.agreed_fare, v_service_fee, v_trip.agreed_fare);

  select id into v_partner_wallet_id from wallets where owner_id = v_trip.partner_id;
  perform apply_wallet_transaction(v_partner_wallet_id, 'trip_earning', v_trip.agreed_fare, p_trip_id, 'Trip earnings');
  perform apply_wallet_transaction(
    v_partner_wallet_id, 'platform_service_fee', -v_service_fee, p_trip_id,
    format('FastGo platform service fee (%s%%)', round(p_platform_service_fee_pct * 100))
  );

  if v_trip.payment_method = 'wallet' then
    select id into v_passenger_wallet_id from wallets where owner_id = v_trip.passenger_id;
    perform apply_wallet_transaction(v_passenger_wallet_id, 'ride_payment', -v_trip.agreed_fare, p_trip_id, 'Ride payment');
    insert into payments (trip_id, method, amount, status) values (p_trip_id, 'wallet', v_trip.agreed_fare, 'completed');
  else
    insert into payments (trip_id, method, amount, status) values (p_trip_id, v_trip.payment_method, v_trip.agreed_fare, 'completed');
  end if;

  update partners set total_trips = total_trips + 1 where id = v_trip.partner_id;
  perform refresh_passenger_credit_limit(v_trip.passenger_id);
  perform refresh_profile_tier(v_trip.passenger_id);
  perform refresh_profile_tier(v_trip.partner_id);
end;
$$ language plpgsql security definer;
