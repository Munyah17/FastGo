-- FastGo schema — 0003: councils, compliance engine, insurance
--
-- Zimbabwean transport regulation is council-specific (Urban Councils Act
-- powers over taxi-cabs vary by by-law). council_rules is a configuration
-- table, not code — new councils and new rules are added as data, not
-- deployments. Document expiry automatically drives partner_documents.status
-- and compliance_events, which is what pauses matching (see 0008 functions).

create table councils (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  province text,
  created_at timestamptz not null default now()
);

comment on table councils is
  'Launch councils (Harare, Bulawayo, Chitungwiza, Mutare, Gweru, Victoria Falls, ...). Each can be activated independently.';

alter table partners
  add constraint partners_primary_council_id_fkey
  foreign key (primary_council_id) references councils (id);

create table council_rules (
  id uuid primary key default gen_random_uuid(),
  council_id uuid not null references councils (id) on delete cascade,
  rule_key text not null,
  rule_value jsonb not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (council_id, rule_key)
);

comment on table council_rules is
  'Configurable per-council operating rules, e.g. {"rule_key": "requires_operator_permit", "rule_value": true} or {"rule_key": "designated_pickup_only", "rule_value": true}. Read by the dispatch/compliance engine, not hard-coded per council.';

create table service_zones (
  id uuid primary key default gen_random_uuid(),
  council_id uuid not null references councils (id) on delete cascade,
  name text not null,
  zone_type zone_type not null,
  boundary geography(polygon, 4326) not null,
  created_at timestamptz not null default now()
);

comment on table service_zones is
  'Geofenced zones per council: permitted (normal pickup/dropoff), restricted (warn partner), forbidden (block). Lets the app warn a partner before they violate a local by-law rather than after.';

create index service_zones_boundary_gix on service_zones using gist (boundary);

create table partner_documents (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references partners (id) on delete cascade,
  vehicle_id uuid references vehicles (id) on delete cascade,
  council_id uuid references councils (id),
  doc_type document_type not null,
  document_number text,
  issuing_authority text,
  issued_at date,
  expires_at date not null,
  file_url text,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

comment on table partner_documents is
  'National docs (licence, national ID) attach to the partner; vehicle docs (registration, insurance, roadworthy) attach to a vehicle; council_permit attaches to a council. Status is derived from expires_at, not stored — see compute_document_status() in 0007_functions.sql.';

create index partner_documents_partner_id_idx on partner_documents (partner_id);
create index partner_documents_vehicle_id_idx on partner_documents (vehicle_id);
create index partner_documents_expires_at_idx on partner_documents (expires_at);

create table compliance_events (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references partners (id) on delete cascade,
  document_id uuid references partner_documents (id),
  event_type compliance_event_type not null,
  details jsonb,
  created_at timestamptz not null default now()
);

comment on table compliance_events is
  'Append-only audit trail answering "why was this partner allowed/paused to operate at time X" — for operations, for disputes, and for partners facing arbitrary enforcement to show a documented compliance history.';

create index compliance_events_partner_id_idx on compliance_events (partner_id);

create table insurance_policies (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references partners (id) on delete cascade,
  provider text not null default 'Motions',
  policy_number text not null,
  cover_start date not null,
  cover_end date not null,
  monthly_premium numeric(10, 2) not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create index insurance_policies_partner_id_idx on insurance_policies (partner_id);
