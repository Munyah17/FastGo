-- FastGo schema — 0008: row-level security
--
-- Default posture: deny by default, grant narrow owner/participant access.
-- Ledger and status-changing tables intentionally have NO update policy for
-- authenticated users — those mutations only happen through the SECURITY
-- DEFINER functions in 0007_functions.sql, or via the service role from a
-- trusted backend job. Reference/configuration tables (councils,
-- council_rules, service_zones, incentives) are readable by anyone signed
-- in, since the app needs them to render compliance info and offers.

alter table profiles enable row level security;
alter table partners enable row level security;
alter table vehicles enable row level security;
alter table trusted_contacts enable row level security;
alter table wallets enable row level security;
alter table councils enable row level security;
alter table council_rules enable row level security;
alter table service_zones enable row level security;
alter table partner_documents enable row level security;
alter table compliance_events enable row level security;
alter table insurance_policies enable row level security;
alter table ride_requests enable row level security;
alter table ride_offers enable row level security;
alter table trips enable row level security;
alter table trip_locations enable row level security;
alter table fares enable row level security;
alter table payments enable row level security;
alter table wallet_transactions enable row level security;
alter table incentives enable row level security;
alter table incentive_progress enable row level security;
alter table ratings enable row level security;
alter table sos_events enable row level security;
alter table incident_reports enable row level security;
alter table notifications enable row level security;
alter table messages enable row level security;

-- profiles ---------------------------------------------------------------
create policy "profiles: read own" on profiles for select using (auth.uid() = id);
create policy "profiles: update own" on profiles for update using (auth.uid() = id);

-- partners -----------------------------------------------------------------
-- status is guarded separately by prevent_partner_self_status_change().
create policy "partners: read own" on partners for select using (auth.uid() = id);
create policy "partners: onboard self" on partners for insert with check (auth.uid() = id);
create policy "partners: update own" on partners for update using (auth.uid() = id);

-- vehicles -------------------------------------------------------------
create policy "vehicles: manage own" on vehicles for all
  using (partner_id = auth.uid()) with check (partner_id = auth.uid());

-- trusted_contacts -------------------------------------------------------
create policy "trusted_contacts: manage own" on trusted_contacts for all
  using (profile_id = auth.uid()) with check (profile_id = auth.uid());

-- wallets ------------------------------------------------------------------
-- balance only ever changes via wallet_transactions + trip-lifecycle functions.
create policy "wallets: read own" on wallets for select using (owner_id = auth.uid());

-- reference/config data ----------------------------------------------------
create policy "councils: readable by any signed-in user" on councils
  for select using (auth.uid() is not null);
create policy "council_rules: readable by any signed-in user" on council_rules
  for select using (auth.uid() is not null);
create policy "service_zones: readable by any signed-in user" on service_zones
  for select using (auth.uid() is not null);
create policy "incentives: readable by any signed-in user" on incentives
  for select using (auth.uid() is not null);

-- partner_documents ----------------------------------------------------
create policy "partner_documents: read own" on partner_documents
  for select using (partner_id = auth.uid());
create policy "partner_documents: upload own" on partner_documents
  for insert with check (partner_id = auth.uid());
create policy "partner_documents: edit own before verification" on partner_documents
  for update using (partner_id = auth.uid() and verified_at is null);

-- compliance_events ----------------------------------------------------
-- A partner can always see their own audit trail (this is central to the
-- driver-protection mission) but cannot write to it — only the compliance
-- engine (service role) does.
create policy "compliance_events: read own" on compliance_events
  for select using (partner_id = auth.uid());

-- insurance_policies -----------------------------------------------------
create policy "insurance_policies: read own" on insurance_policies
  for select using (partner_id = auth.uid());

-- ride_requests --------------------------------------------------------
-- Partners find requests exclusively through find_nearby_open_requests();
-- there is intentionally no partner-facing select policy on this table.
create policy "ride_requests: passenger manages own" on ride_requests for all
  using (passenger_id = auth.uid()) with check (passenger_id = auth.uid());

-- ride_offers ------------------------------------------------------------
create policy "ride_offers: partner manages own offers" on ride_offers for all
  using (partner_id = auth.uid()) with check (partner_id = auth.uid());
create policy "ride_offers: passenger reads offers on own requests" on ride_offers
  for select using (
    exists (select 1 from ride_requests r where r.id = request_id and r.passenger_id = auth.uid())
  );

-- trips --------------------------------------------------------------------
-- No update policy: status transitions only via accept_ride_offer(),
-- start_trip(), complete_trip(), cancel_trip().
create policy "trips: participants read" on trips
  for select using (passenger_id = auth.uid() or partner_id = auth.uid());

-- trip_locations -----------------------------------------------------------
create policy "trip_locations: partner reports own trip location" on trip_locations
  for insert with check (
    exists (select 1 from trips t where t.id = trip_id and t.partner_id = auth.uid())
  );
create policy "trip_locations: participants read" on trip_locations
  for select using (is_trip_participant(trip_id));

-- fares / payments ---------------------------------------------------------
-- Written only by complete_trip(); no client insert/update policy.
create policy "fares: participants read" on fares
  for select using (is_trip_participant(trip_id));
create policy "payments: participants read" on payments
  for select using (is_trip_participant(trip_id));

-- wallet_transactions --------------------------------------------------
-- Written only by trip-lifecycle functions / top-up & withdrawal Edge
-- Functions running as service role.
create policy "wallet_transactions: read own" on wallet_transactions
  for select using (
    exists (select 1 from wallets w where w.id = wallet_id and w.owner_id = auth.uid())
  );

-- incentive_progress -----------------------------------------------------
create policy "incentive_progress: read own" on incentive_progress
  for select using (partner_id = auth.uid());

-- ratings --------------------------------------------------------------
create policy "ratings: submit for own trips" on ratings
  for insert with check (rater_id = auth.uid() and is_trip_participant(trip_id));
create policy "ratings: read own given or received" on ratings
  for select using (rater_id = auth.uid() or ratee_id = auth.uid());

-- sos_events -------------------------------------------------------------
create policy "sos_events: trigger own" on sos_events
  for insert with check (triggered_by = auth.uid());
create policy "sos_events: read own" on sos_events
  for select using (triggered_by = auth.uid());

-- incident_reports -------------------------------------------------------
create policy "incident_reports: file own" on incident_reports
  for insert with check (reporter_id = auth.uid());
create policy "incident_reports: read own" on incident_reports
  for select using (reporter_id = auth.uid());

-- notifications --------------------------------------------------------
-- Written by the backend (service role); users may only mark their own read.
create policy "notifications: read own" on notifications
  for select using (profile_id = auth.uid());
create policy "notifications: mark own read" on notifications
  for update using (profile_id = auth.uid()) with check (profile_id = auth.uid());

-- messages -----------------------------------------------------------------
create policy "messages: send as self" on messages
  for insert with check (sender_id = auth.uid());
create policy "messages: read own thread" on messages
  for select using (sender_id = auth.uid() or recipient_id = auth.uid());
create policy "messages: mark received read" on messages
  for update using (recipient_id = auth.uid()) with check (recipient_id = auth.uid());
