-- FastGo schema — 0017: close the grants gap left by 0012-0016.
--
-- 0009 established the pattern: Postgres grants EXECUTE to PUBLIC (which
-- includes anon) on every new function by default, so anything sensitive
-- needs an explicit revoke-then-grant-to-authenticated. That pattern was
-- only applied to functions that existed as of 0009 — everything added in
-- 0012 through 0016 (fraud scoring, wallet P2P, credit limits, the new
-- accept_ride_offer overload) has been sitting reachable by anon this
-- entire time. This migration is the sweep that should have shipped
-- alongside each of those.

-- Internal/scheduled-only functions: never meant to be called directly by
-- a client at all (triggers fire regardless of the invoking role's EXECUTE
-- grants — that's a separate Postgres mechanism from RPC-callable EXECUTE).
revoke execute on function
  sync_partner_compliance(),
  evaluate_cancellation_fraud(integer),
  prevent_partner_self_status_change(),
  flag_low_rating(),
  refresh_profile_rating(),
  set_updated_at(),
  handle_new_user(),
  enforce_minimum_fare(),
  enforce_minimum_offer()
  from public;

-- Legitimately client-callable, but authenticated-only.
revoke execute on function
  accept_ride_offer(uuid, payment_method),
  count_recent_partner_cancellations(uuid),
  cancellation_strike_threshold(),
  cancellation_strike_window(),
  compute_cancellation_fraud_score(uuid),
  fraud_score_threshold(),
  minimum_fare(),
  record_wallet_topup(numeric, payment_method),
  withdraw_funds(numeric, payment_method),
  send_wallet_funds(numeric, text, uuid, text),
  refresh_passenger_credit_limit(uuid),
  recompute_passenger_credit_limit(uuid),
  apply_wallet_transaction(uuid, wallet_txn_type, numeric, uuid, text)
  from public;

grant execute on function
  accept_ride_offer(uuid, payment_method),
  count_recent_partner_cancellations(uuid),
  cancellation_strike_threshold(),
  cancellation_strike_window(),
  fraud_score_threshold(),
  minimum_fare(),
  record_wallet_topup(numeric, payment_method),
  withdraw_funds(numeric, payment_method),
  send_wallet_funds(numeric, text, uuid, text)
  to authenticated;

-- compute_cancellation_fraud_score, recompute_passenger_credit_limit, and
-- apply_wallet_transaction intentionally get NO authenticated grant either:
-- they're read/write internals called BY the functions above (which run
-- as their caller's SECURITY DEFINER context, not requiring their own
-- EXECUTE grant on functions they call from inside plpgsql), never meant
-- to be invoked directly over the API.
