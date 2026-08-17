-- FastGo schema — 0001: extensions & shared enum types
--
-- FastGo is a technology marketplace that connects independent partners
-- (drivers/car owners sharing their own vehicle, on their own terms) with
-- passengers looking for a ride to share. FastGo verifies, matches, and
-- provides safety tooling — it does not own vehicles, does not employ
-- partners, and does not itself provide transportation.
-- See docs/POSITIONING.md for the full framing this schema follows.

create extension if not exists postgis;
create extension if not exists pgcrypto;

-- A partner's onboarding/compliance state. "pending_review" until identity,
-- licence and vehicle documents are verified. "suspended" is always tied to
-- a compliance_events row explaining why (see 0003_compliance.sql).
create type partner_status as enum (
  'pending_review',
  'active',
  'suspended',
  'deactivated'
);

create type document_type as enum (
  'drivers_license',
  'vehicle_registration',
  'insurance',
  'roadworthy',
  'council_permit',
  'national_id'
);

create type document_status as enum (
  'valid',
  'expiring_soon',
  'expired'
);

create type zone_type as enum (
  'permitted',
  'restricted',
  'forbidden'
);

create type compliance_event_type as enum (
  'document_submitted',
  'document_verified',
  'document_expiring',
  'document_expired',
  'partner_suspended',
  'partner_reinstated',
  'geofence_notice',
  'manual_review'
);

-- A ride_request is the passenger's ask. A ride_offer is a partner's
-- response — accept the suggested fare, or counter it (inDrive-style
-- negotiation). A trip only exists once passenger and partner agree.
create type ride_status as enum (
  'searching',
  'matched',
  'enroute_pickup',
  'in_progress',
  'completed',
  'cancelled'
);

create type offer_status as enum (
  'pending',
  'accepted',
  'declined',
  'countered',
  'expired'
);

create type payment_method as enum (
  'ecocash',
  'onemoney',
  'card',
  'paynow',
  'cash',
  'wallet'
);

create type payment_status as enum (
  'pending',
  'completed',
  'failed',
  'refunded'
);

-- Wallet ledger entry types. "platform_service_fee" is FastGo's disclosed
-- marketplace commission on a completed connection — not a fare FastGo sets
-- unilaterally; the fare itself is agreed between passenger and partner.
create type wallet_txn_type as enum (
  'topup',
  'withdrawal',
  'trip_earning',
  'platform_service_fee',
  'bonus',
  'adjustment'
);

create type sos_status as enum (
  'triggered',
  'acknowledged',
  'resolved',
  'false_alarm'
);
