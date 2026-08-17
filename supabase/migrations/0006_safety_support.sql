-- FastGo schema — 0006: ratings, SOS, incident reports, notifications, messages

create table ratings (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips (id) on delete cascade,
  rater_id uuid not null references profiles (id),
  ratee_id uuid not null references profiles (id),
  stars smallint not null check (stars between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (trip_id, rater_id)
);

comment on table ratings is
  'A low rating alone never triggers an automated suspension — see flag_low_rating() in 0007_functions.sql, which raises a manual_review compliance_event instead of an automatic ban.';

create table sos_events (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips (id),
  triggered_by uuid not null references profiles (id),
  location geography(point, 4326) not null,
  status sos_status not null default 'triggered',
  notes text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index sos_events_trip_id_idx on sos_events (trip_id);

create table incident_reports (
  id uuid primary key default gen_random_uuid(),
  reference_code text not null unique default ('IR-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(floor(random() * 1000)::text, 3, '0')),
  reporter_id uuid not null references profiles (id),
  trip_id uuid references trips (id),
  category text not null,
  details text,
  status text not null default 'submitted',
  created_at timestamptz not null default now()
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles (id) on delete cascade,
  title text not null,
  body text not null,
  tone text not null default 'brand',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_profile_id_idx on notifications (profile_id, created_at desc);

create table messages (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips (id),
  sender_id uuid not null references profiles (id),
  recipient_id uuid not null references profiles (id),
  body text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index messages_trip_id_idx on messages (trip_id, created_at);
create index messages_recipient_id_idx on messages (recipient_id, read_at);
