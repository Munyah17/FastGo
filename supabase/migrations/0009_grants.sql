-- FastGo schema — 0009: role grants
--
-- Recent Supabase CLI defaults stop auto-exposing new public-schema objects
-- to the anon/authenticated Data API roles (see the auto_expose_new_tables
-- note in supabase/config.toml). RLS policies restrict rows; without a
-- table-level GRANT there is nothing for RLS to restrict — PostgREST gets a
-- flat permission-denied instead. Table privileges here are intentionally
-- broad (full CRUD to authenticated); every table has RLS enabled from
-- 0008_rls.sql, so row-level access is still governed by those policies.

grant usage on schema public to anon, authenticated;

grant select, insert, update, delete
  on all tables in schema public
  to authenticated;

-- Reference/configuration data has "readable by any signed-in user" RLS
-- policies already; anon gets the table grant too but RLS on councils,
-- council_rules, service_zones and incentives still requires auth.uid() is
-- not null, so a signed-out request continues to see zero rows.
grant select on councils, council_rules, service_zones, incentives to anon;

grant select on partner_documents_status, partner_compliance to authenticated;

-- Sensitive RPCs: default Postgres grants EXECUTE to PUBLIC on new
-- functions. Revoke that (scoped to FastGo's own functions only — NOT a
-- blanket "all functions in schema public", which would also sweep up
-- every PostGIS system function installed in public) and grant explicitly
-- so anon can never call trip-mutating or compliance-mutating functions.
revoke execute on function
  is_trip_participant(uuid),
  get_matched_counterpart(uuid),
  find_nearby_open_requests(integer),
  accept_ride_offer(uuid),
  start_trip(uuid),
  complete_trip(uuid, numeric, numeric, numeric),
  cancel_trip(uuid, text),
  compute_document_status(date)
  from public;

grant execute on function
  is_trip_participant(uuid),
  get_matched_counterpart(uuid),
  find_nearby_open_requests(integer),
  accept_ride_offer(uuid),
  start_trip(uuid),
  complete_trip(uuid, numeric, numeric, numeric),
  cancel_trip(uuid, text),
  compute_document_status(date)
  to authenticated;

-- sync_partner_compliance() and the trigger functions are invoked by
-- pg_cron/triggers running as table owner, not called directly by clients,
-- so they intentionally get no authenticated/anon grant.
