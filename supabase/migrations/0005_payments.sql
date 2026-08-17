-- FastGo schema — 0005: fares, payments, wallet ledger
--
-- fares.total_fare is the amount the passenger and partner agreed to (via
-- ride_offers) — FastGo is not setting a tariff, it is recording the
-- agreed price and its own disclosed service fee on top.

create table fares (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null unique references trips (id) on delete cascade,
  base_fare numeric(10, 2) not null default 0,
  distance_fare numeric(10, 2) not null default 0,
  time_fare numeric(10, 2) not null default 0,
  platform_service_fee numeric(10, 2) not null default 0,
  total_fare numeric(10, 2) not null,
  currency text not null default 'USD',
  created_at timestamptz not null default now()
);

comment on column fares.platform_service_fee is
  'FastGo''s disclosed marketplace commission on this completed connection — deducted from the partner''s payout, not added on top of what the passenger agreed to pay.';

create table payments (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips (id) on delete cascade,
  method payment_method not null,
  amount numeric(10, 2) not null,
  status payment_status not null default 'pending',
  provider text,
  provider_ref text,
  created_at timestamptz not null default now()
);

comment on table payments is
  'Digital methods route through licensed payment service providers (EcoCash, OneMoney, Paynow, card processors) — FastGo does not act as a payment system itself. Cash trips are recorded here for reconciliation against the partner wallet.';

create index payments_trip_id_idx on payments (trip_id);

create table wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid not null references wallets (id) on delete cascade,
  type wallet_txn_type not null,
  amount numeric(12, 2) not null,
  related_trip_id uuid references trips (id),
  description text,
  created_at timestamptz not null default now()
);

comment on table wallet_transactions is
  'Append-only ledger. Positive amount = credit to the wallet holder, negative = debit. Cash-trip platform_service_fee entries are negative here even though no digital payment moved, so a partner''s payable-to-FastGo balance stays accurate.';

create index wallet_transactions_wallet_id_idx on wallet_transactions (wallet_id, created_at desc);

create table incentives (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  council_id uuid references councils (id),
  target_trips integer not null,
  reward_amount numeric(10, 2) not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table incentive_progress (
  id uuid primary key default gen_random_uuid(),
  incentive_id uuid not null references incentives (id) on delete cascade,
  partner_id uuid not null references partners (id) on delete cascade,
  trips_completed integer not null default 0,
  completed_at timestamptz,
  unique (incentive_id, partner_id)
);
