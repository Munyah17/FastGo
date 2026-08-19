-- FastGo schema — 0023: vehicle designations.
--
-- The fixed classification a partner's vehicle registers as. Matches
-- src/lib/data.ts's vehicleDesignations list exactly — keep both in sync.
-- delivery and bike carry parcels only, never passengers.
create type vehicle_category as enum (
  'ordinary',
  'four_seater',
  'seven_seater',
  'comfort',
  'luxury',
  'exclusive',
  'delivery',
  'bike'
);

alter table vehicles add column category vehicle_category not null default 'ordinary';

comment on column vehicles.category is
  'What kind of vehicle this is for matching/pricing purposes — see the vehicle_category enum. Set once at registration (onboarding partner vehicle step), changeable afterward like any other vehicle detail.';

comment on column ride_requests.vehicle_class is
  'Which vehicle_category the passenger is requesting. Kept as free text (not FK''d to the enum) rather than vehicles.category, since FastGo Core''s matching logic may want a soft fallback across adjacent categories when no exact match is nearby — but values should be one of vehicle_category''s ids.';
