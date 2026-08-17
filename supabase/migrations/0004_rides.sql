-- FastGo schema — 0004: ride requests, offers, trips
--
-- A ride_request is the passenger's ask (destination + suggested fare).
-- A ride_offer is a partner's response: accept, decline, or counter — this
-- is the inDrive-style negotiation model. A trip is created only once a
-- specific offer is accepted by the passenger; FastGo facilitates the
-- match and keeps the record, it is not a party to the carriage itself.

create table ride_requests (
  id uuid primary key default gen_random_uuid(),
  passenger_id uuid not null references profiles (id) on delete cascade,
  pickup_location geography(point, 4326) not null,
  pickup_address text not null,
  dropoff_location geography(point, 4326) not null,
  dropoff_address text not null,
  vehicle_class text not null default 'lite',
  suggested_fare numeric(10, 2) not null,
  council_id uuid references councils (id),
  status ride_status not null default 'searching',
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '5 minutes')
);

create index ride_requests_passenger_id_idx on ride_requests (passenger_id);
create index ride_requests_status_idx on ride_requests (status);
create index ride_requests_pickup_gix on ride_requests using gist (pickup_location);

create table ride_offers (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references ride_requests (id) on delete cascade,
  partner_id uuid not null references partners (id) on delete cascade,
  offered_fare numeric(10, 2) not null,
  eta_minutes smallint,
  status offer_status not null default 'pending',
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  unique (request_id, partner_id)
);

comment on table ride_offers is
  'Each row is one partner responding to one request. The passenger accepts exactly one offer per request, which creates the trip.';

create index ride_offers_request_id_idx on ride_offers (request_id);
create index ride_offers_partner_id_idx on ride_offers (partner_id);

create table trips (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique references ride_requests (id),
  offer_id uuid not null unique references ride_offers (id),
  passenger_id uuid not null references profiles (id),
  partner_id uuid not null references partners (id),
  vehicle_id uuid not null references vehicles (id),
  agreed_fare numeric(10, 2) not null,
  status ride_status not null default 'matched',
  pickup_location geography(point, 4326) not null,
  dropoff_location geography(point, 4326) not null,
  distance_km numeric(6, 2),
  duration_min numeric(6, 1),
  started_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  cancelled_by uuid references profiles (id),
  created_at timestamptz not null default now()
);

comment on table trips is
  'The connection FastGo facilitated between a passenger and a partner. The transportation contract is between the two parties; this row is FastGo''s record for matching, safety, payments and dispute resolution.';

create index trips_passenger_id_idx on trips (passenger_id);
create index trips_partner_id_idx on trips (partner_id);
create index trips_status_idx on trips (status);

create table trip_locations (
  id bigint generated always as identity primary key,
  trip_id uuid not null references trips (id) on delete cascade,
  location geography(point, 4326) not null,
  recorded_at timestamptz not null default now()
);

comment on table trip_locations is
  'GPS breadcrumb trail for an in-progress trip — powers live tracking, trip sharing, and post-incident review. Retention should follow the Cyber and Data Protection Act guidance in docs/POSITIONING.md.';

create index trip_locations_trip_id_idx on trip_locations (trip_id, recorded_at);
