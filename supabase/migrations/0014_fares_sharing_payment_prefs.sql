-- FastGo schema — 0014: minimum fare enforcement, ride-sharing/pooling,
-- driver payment-method preference.

-- ---------------------------------------------------------------------
-- minimum fare — single source of truth, matches cancellation_strike_*()
-- pattern from 0012 so tuning never means hunting for scattered literals.
-- ---------------------------------------------------------------------
create function minimum_fare() returns numeric as $$
  select 2.00;
$$ language sql immutable;

create function enforce_minimum_fare() returns trigger as $$
begin
  if new.suggested_fare < minimum_fare() then
    raise exception 'offered fare US$% is below the US$% minimum', new.suggested_fare, minimum_fare();
  end if;
  return new;
end;
$$ language plpgsql;

create trigger ride_requests_enforce_minimum_fare
  before insert or update on ride_requests
  for each row execute function enforce_minimum_fare();

create function enforce_minimum_offer() returns trigger as $$
begin
  if new.offered_fare < minimum_fare() then
    raise exception 'offer US$% is below the US$% minimum', new.offered_fare, minimum_fare();
  end if;
  return new;
end;
$$ language plpgsql;

create trigger ride_offers_enforce_minimum_fare
  before insert or update on ride_offers
  for each row execute function enforce_minimum_offer();

-- ---------------------------------------------------------------------
-- ride-sharing / pooling: a passenger opts their request into sharing;
-- trip_passengers holds any additional co-passengers a shared trip picks
-- up along the way. trips.passenger_id stays the primary rider so every
-- existing single-passenger flow (accept_ride_offer, get_matched_counterpart,
-- etc.) keeps working unmodified — this is purely additive.
-- ---------------------------------------------------------------------
alter table ride_requests add column shareable boolean not null default false;

comment on column ride_requests.shareable is
  'Passenger opted in to a pooled/shared ride for a fare discount — the dispatch engine may match this request onto a trip that already has a primary passenger heading the same direction.';

create table trip_passengers (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips (id) on delete cascade,
  passenger_id uuid not null references profiles (id),
  pickup_location geography(point, 4326) not null,
  pickup_address text not null,
  dropoff_location geography(point, 4326) not null,
  dropoff_address text not null,
  fare_share numeric(10, 2) not null,
  status text not null default 'waiting' check (status in ('waiting', 'picked_up', 'dropped_off', 'cancelled')),
  created_at timestamptz not null default now(),
  unique (trip_id, passenger_id)
);

comment on table trip_passengers is
  'Additional co-passengers on a shared/pooled trip beyond trips.passenger_id (the primary rider who set the trip in motion). Each row is one rider''s own pickup/dropoff and their share of the fare.';

create index trip_passengers_trip_id_idx on trip_passengers (trip_id);

alter table trip_passengers enable row level security;

create policy trip_passengers_select_own on trip_passengers
  for select using (
    passenger_id = auth.uid()
    or exists (select 1 from trips where id = trip_id and partner_id = auth.uid())
  );

create policy trip_passengers_insert_own on trip_passengers
  for insert with check (passenger_id = auth.uid());

grant select, insert on trip_passengers to authenticated;

-- ---------------------------------------------------------------------
-- driver payment-method preference
-- ---------------------------------------------------------------------
create type partner_payment_preference as enum ('all_methods', 'wallet_only');

alter table partners
  add column payment_preference partner_payment_preference not null default 'all_methods';

comment on column partners.payment_preference is
  'wallet_only partners are only matched with passengers paying via FastGo Wallet — removes cash-collection fee-evasion risk entirely for that partner, at the cost of a smaller matching pool.';
