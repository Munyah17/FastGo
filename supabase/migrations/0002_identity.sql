-- FastGo schema — 0002: identity, partners, wallets
--
-- One person can be a passenger, a partner, or both — the same phone
-- number/profile carries both roles. "partners" is a thin extension table,
-- not a separate employment record: it holds marketplace-relevant state
-- (verification status, track record) for someone who chooses to share
-- their own vehicle, never a contract of employment.

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  phone text unique not null,
  full_name text not null,
  avatar_url text,
  is_partner boolean not null default false,
  is_passenger boolean not null default true,
  rating_avg numeric(3, 2) not null default 5.00,
  rating_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table profiles is
  'One row per person. is_partner/is_passenger are independent flags — the same person can request rides and share their own vehicle.';

create table partners (
  id uuid primary key references profiles (id) on delete cascade,
  status partner_status not null default 'pending_review',
  primary_council_id uuid, -- fk added in 0003_compliance.sql (councils not yet defined)
  acceptance_rate numeric(5, 2),
  total_trips integer not null default 0,
  partner_since date not null default current_date,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table partners is
  'Independent partners who share their own ride/vehicle on their own terms. FastGo verifies and matches; it does not employ, schedule, or dispatch partners as staff.';

create table vehicles (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references partners (id) on delete cascade,
  make text not null,
  model text not null,
  year smallint,
  colour text,
  plate text not null unique,
  seats smallint not null default 4,
  photo_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

comment on table vehicles is
  'Vehicles are owned by the partner, never by FastGo. A partner may register more than one vehicle over time; only is_active vehicles can be offered for matching.';

create table trusted_contacts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles (id) on delete cascade,
  name text not null,
  phone text not null,
  relation text,
  created_at timestamptz not null default now()
);

create table wallets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references profiles (id) on delete cascade,
  balance numeric(12, 2) not null default 0,
  currency text not null default 'USD',
  updated_at timestamptz not null default now()
);

create index vehicles_partner_id_idx on vehicles (partner_id);
create index trusted_contacts_profile_id_idx on trusted_contacts (profile_id);
