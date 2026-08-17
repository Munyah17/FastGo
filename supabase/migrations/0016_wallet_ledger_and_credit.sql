-- FastGo schema — 0016: withdrawable-balance provenance tracking, P2P
-- transfers, passenger negative-balance credit scoring, and completing the
-- passenger-side of trip payment (previously only the partner's payout was
-- modeled — complete_trip() never actually charged anyone).
--
-- Core rule this migration enforces: withdrawability is tracked by WHERE
-- the money came from, not by who owns the wallet. One profile can be both
-- passenger and partner sharing a single wallet (see docs/POSITIONING.md /
-- fastgo-app-architecture memory) — so "passenger deposits aren't
-- withdrawable, driver earnings are" can't be a role check, it has to be a
-- fund-provenance check. Every wallet carries balance (total spendable,
-- can go negative up to credit_limit) and withdrawable_balance (never
-- exceeds balance; only trip_earning credits and withdrawal debits move
-- it — topups and P2P receipts never do).

alter table wallets
  add column withdrawable_balance numeric(12, 2) not null default 0,
  add column credit_limit numeric(12, 2) not null default 0;

alter table wallets add constraint wallets_withdrawable_le_balance check (withdrawable_balance <= balance);
alter table wallets add constraint wallets_balance_within_credit check (balance >= -credit_limit);

comment on column wallets.withdrawable_balance is
  'The withdraw-to-bank-or-mobile-money-eligible slice of balance. Only trip_earning credits it and withdrawal debits it 1:1 — every other transaction type can only ever shrink it via the clamp in apply_wallet_transaction(), never grow it. This is what makes "passenger deposits can''t be withdrawn, driver earnings can" true for a single shared wallet model.';

comment on column wallets.credit_limit is
  'How far balance may go negative. Always 0 for brand-new accounts; grows only via recompute_passenger_credit_limit()''s usage-based scoring below. Never set directly by a client.';

-- ---------------------------------------------------------------------
-- centralized ledger writer — every wallet-touching function in this
-- schema goes through this, so the withdrawable/credit invariants can
-- only be maintained correctly in one place.
-- ---------------------------------------------------------------------
create function apply_wallet_transaction(
  p_wallet_id uuid,
  p_type wallet_txn_type,
  p_amount numeric, -- positive = credit, negative = debit
  p_related_trip_id uuid default null,
  p_description text default null
) returns void as $$
declare
  v_balance numeric;
  v_withdrawable numeric;
  v_credit_limit numeric;
  v_new_balance numeric;
  v_new_withdrawable numeric;
begin
  select balance, withdrawable_balance, credit_limit
    into v_balance, v_withdrawable, v_credit_limit
    from wallets where id = p_wallet_id for update;

  if v_balance is null then
    raise exception 'wallet not found';
  end if;

  v_new_balance := v_balance + p_amount;

  if v_new_balance < -v_credit_limit then
    raise exception 'insufficient balance: this would take the wallet to US$% against a US$% credit limit',
      round(v_new_balance, 2), v_credit_limit;
  end if;

  v_new_withdrawable := v_withdrawable;
  if p_type = 'trip_earning' then
    v_new_withdrawable := v_new_withdrawable + p_amount;
  elsif p_type = 'withdrawal' then
    v_new_withdrawable := v_new_withdrawable + p_amount; -- p_amount negative here
  end if;
  -- invariant: withdrawable_balance can never exceed balance, and any debit
  -- that eats past the non-withdrawable portion shrinks it accordingly.
  v_new_withdrawable := greatest(least(v_new_withdrawable, v_new_balance), 0);

  insert into wallet_transactions (wallet_id, type, amount, related_trip_id, description)
  values (p_wallet_id, p_type, p_amount, p_related_trip_id, p_description);

  update wallets set
    balance = v_new_balance,
    withdrawable_balance = v_new_withdrawable,
    updated_at = now()
  where id = p_wallet_id;
end;
$$ language plpgsql security definer set search_path = public;

comment on function apply_wallet_transaction is
  'The only function that should ever UPDATE wallets.balance/withdrawable_balance. Every trip settlement, P2P transfer, topup and withdrawal in this schema routes through here — see complete_trip(), send_wallet_funds(), withdraw_funds(), pay_insurance_premium() below.';

-- ---------------------------------------------------------------------
-- passenger negative-balance credit scoring
-- ---------------------------------------------------------------------
create function recompute_passenger_credit_limit(p_profile_id uuid) returns numeric as $$
declare
  v_account_age_days integer;
  v_completed_trips integer;
  v_total_topups numeric;
  v_cash_trips integer;
  v_wallet_trips integer;
  v_cash_ratio numeric;
  v_limit numeric;
begin
  select coalesce(extract(day from now() - created_at)::integer, 0) into v_account_age_days
  from profiles where id = p_profile_id;

  select count(*) into v_completed_trips
  from trips where passenger_id = p_profile_id and status = 'completed';

  -- Brand-new accounts get zero credit, full stop — no exceptions, no
  -- amount of topping-up on day one buys trust that only usage history can.
  if v_account_age_days < 30 or v_completed_trips < 5 then
    return 0;
  end if;

  select coalesce(sum(amount), 0) into v_total_topups
  from wallet_transactions wt join wallets w on w.id = wt.wallet_id
  where w.owner_id = p_profile_id and wt.type = 'topup';

  select
    count(*) filter (where pay.method = 'cash'),
    count(*) filter (where pay.method = 'wallet')
    into v_cash_trips, v_wallet_trips
  from trips t join payments pay on pay.trip_id = t.id
  where t.passenger_id = p_profile_id and t.status = 'completed';

  v_cash_ratio := case when (v_cash_trips + v_wallet_trips) = 0 then 0
    else v_cash_trips::numeric / (v_cash_trips + v_wallet_trips) end;

  -- Heavy cash/off-platform users are never trusted with credit, regardless
  -- of tenure — there's no on-platform payment history to judge them by.
  if v_cash_ratio > 0.5 then
    return 0;
  end if;

  v_limit := least(10.00, (v_total_topups * 0.05) + (v_completed_trips * 0.15) - (v_cash_ratio * 10));
  return greatest(round(v_limit, 2), 0);
end;
$$ language plpgsql security definer stable;

comment on function recompute_passenger_credit_limit is
  'A starting heuristic, not a claim of precision — tune the coefficients as real usage data comes in. Rewards topup history and completed-trip count, zeroes out for new accounts and cash-heavy users, caps at US$10.';

create function refresh_passenger_credit_limit(p_profile_id uuid) returns void as $$
declare
  v_new_limit numeric;
begin
  v_new_limit := recompute_passenger_credit_limit(p_profile_id);
  update wallets set credit_limit = v_new_limit, updated_at = now() where owner_id = p_profile_id;
end;
$$ language plpgsql security definer set search_path = public;

-- ---------------------------------------------------------------------
-- topups and withdrawals (previously unmodeled — nothing wrote to the
-- ledger from either direction)
-- ---------------------------------------------------------------------
create function record_wallet_topup(p_amount numeric, p_method payment_method) returns void as $$
declare
  v_wallet_id uuid;
begin
  if p_amount <= 0 then
    raise exception 'top-up amount must be positive';
  end if;
  select id into v_wallet_id from wallets where owner_id = auth.uid();
  perform apply_wallet_transaction(v_wallet_id, 'topup', p_amount, null, format('Wallet top-up via %s', p_method));
  perform refresh_passenger_credit_limit(auth.uid());
end;
$$ language plpgsql security definer;

create function withdraw_funds(p_amount numeric, p_method payment_method) returns void as $$
declare
  v_wallet wallets;
begin
  if p_amount <= 0 then
    raise exception 'withdrawal amount must be positive';
  end if;
  select * into v_wallet from wallets where owner_id = auth.uid() for update;
  if v_wallet.withdrawable_balance < p_amount then
    raise exception 'only US$% of your balance is withdrawable (earned from trips) — the rest is top-ups or transfers, which can only be spent or shared',
      v_wallet.withdrawable_balance;
  end if;
  perform apply_wallet_transaction(v_wallet.id, 'withdrawal', -p_amount, null, format('Withdrawal via %s', p_method));
end;
$$ language plpgsql security definer;

-- ---------------------------------------------------------------------
-- passenger-to-passenger transfers
-- ---------------------------------------------------------------------
create function send_wallet_funds(
  p_amount numeric,
  p_recipient_phone text default null,
  p_recipient_id uuid default null,
  p_note text default null
) returns void as $$
declare
  v_sender_wallet wallets;
  v_recipient_id uuid;
  v_recipient_wallet_id uuid;
  v_sendable numeric;
begin
  if p_amount <= 0 then
    raise exception 'transfer amount must be positive';
  end if;

  v_recipient_id := coalesce(p_recipient_id, (select id from profiles where phone = p_recipient_phone));
  if v_recipient_id is null then
    raise exception 'recipient not found';
  end if;
  if v_recipient_id = auth.uid() then
    raise exception 'cannot send funds to yourself';
  end if;

  select * into v_sender_wallet from wallets where owner_id = auth.uid() for update;

  -- The whole point: only the non-withdrawable slice of a wallet can ever
  -- move via P2P. This blocks driver earnings leaving as "gifts" just as
  -- surely as it blocks a passenger cashing out a deposit by wallet-hopping
  -- it through a friend's account — earnings can only ever leave via
  -- withdraw_funds(), which is a completely separate, audited channel.
  v_sendable := v_sender_wallet.balance - v_sender_wallet.withdrawable_balance;
  if p_amount > v_sendable then
    raise exception 'only US$% of your balance is transferable — US$% is driver earnings, which can only be withdrawn, never sent to another wallet',
      round(v_sendable, 2), v_sender_wallet.withdrawable_balance;
  end if;

  select id into v_recipient_wallet_id from wallets where owner_id = v_recipient_id;

  perform apply_wallet_transaction(v_sender_wallet.id, 'p2p_send', -p_amount, null, coalesce(p_note, 'Sent to a FastGo user'));
  perform apply_wallet_transaction(v_recipient_wallet_id, 'p2p_receive', p_amount, null, coalesce(p_note, 'Received from a FastGo user'));
end;
$$ language plpgsql security definer;

comment on function send_wallet_funds is
  'Passenger-to-passenger only, by construction: the sendable check (balance - withdrawable_balance) is zero for any wallet whose spendable funds are entirely driver earnings, so a partner with only trip income has nothing left to send. A partner who also tops up or receives transfers can still send that portion — the rule follows the money, not a role flag.';

-- ---------------------------------------------------------------------
-- complete the trip-payment loop: complete_trip() previously only paid
-- the partner out, never actually charged the passenger.
-- ---------------------------------------------------------------------
alter table trips add column payment_method payment_method not null default 'wallet';

-- accept_ride_offer gains a parameter here — Postgres treats a changed
-- argument list as a distinct overload, so plain CREATE OR REPLACE would
-- leave the old accept_ride_offer(uuid) sitting alongside this one
-- (harmlessly functional, since trips.payment_method defaults to 'wallet'
-- at the column level, but two versions to maintain is its own bug
-- magnet). Drop the old one explicitly instead.
drop function if exists accept_ride_offer(uuid);

create function accept_ride_offer(p_offer_id uuid, p_payment_method payment_method default 'wallet') returns uuid as $$
declare
  v_offer ride_offers;
  v_request ride_requests;
  v_vehicle_id uuid;
  v_trip_id uuid;
begin
  select * into v_offer from ride_offers where id = p_offer_id for update;
  if v_offer is null then
    raise exception 'offer not found';
  end if;

  select * into v_request from ride_requests where id = v_offer.request_id for update;
  if v_request.passenger_id <> auth.uid() then
    raise exception 'only the requesting passenger may accept an offer';
  end if;
  if v_request.status <> 'searching' then
    raise exception 'this request is no longer open';
  end if;

  select id into v_vehicle_id from vehicles
    where partner_id = v_offer.partner_id and is_active = true
    order by created_at desc limit 1;

  update ride_offers set status = 'accepted', responded_at = now() where id = p_offer_id;
  update ride_offers set status = 'declined', responded_at = now()
    where request_id = v_offer.request_id and id <> p_offer_id and status = 'pending';
  update ride_requests set status = 'matched' where id = v_request.id;

  insert into trips (
    request_id, offer_id, passenger_id, partner_id, vehicle_id,
    agreed_fare, status, pickup_location, dropoff_location, payment_method
  ) values (
    v_request.id, v_offer.id, v_request.passenger_id, v_offer.partner_id, v_vehicle_id,
    v_offer.offered_fare, 'matched', v_request.pickup_location, v_request.dropoff_location, p_payment_method
  ) returning id into v_trip_id;

  return v_trip_id;
end;
$$ language plpgsql security definer;

create or replace function complete_trip(
  p_trip_id uuid,
  p_distance_km numeric,
  p_duration_min numeric,
  p_platform_service_fee_pct numeric default 0.15
) returns void as $$
declare
  v_trip trips;
  v_service_fee numeric;
  v_partner_wallet_id uuid;
  v_passenger_wallet_id uuid;
begin
  select * into v_trip from trips where id = p_trip_id for update;
  if v_trip is null or v_trip.partner_id <> auth.uid() then
    raise exception 'trip not found or not yours';
  end if;
  if v_trip.status <> 'in_progress' then
    raise exception 'trip is not in progress';
  end if;

  v_service_fee := round(v_trip.agreed_fare * p_platform_service_fee_pct, 2);

  update trips set
    status = 'completed',
    completed_at = now(),
    distance_km = p_distance_km,
    duration_min = p_duration_min
  where id = p_trip_id;

  insert into fares (trip_id, base_fare, platform_service_fee, total_fare)
  values (p_trip_id, v_trip.agreed_fare, v_service_fee, v_trip.agreed_fare);

  select id into v_partner_wallet_id from wallets where owner_id = v_trip.partner_id;
  perform apply_wallet_transaction(v_partner_wallet_id, 'trip_earning', v_trip.agreed_fare, p_trip_id, 'Trip earnings');
  perform apply_wallet_transaction(
    v_partner_wallet_id, 'platform_service_fee', -v_service_fee, p_trip_id,
    format('FastGo platform service fee (%s%%)', round(p_platform_service_fee_pct * 100))
  );

  if v_trip.payment_method = 'wallet' then
    select id into v_passenger_wallet_id from wallets where owner_id = v_trip.passenger_id;
    perform apply_wallet_transaction(v_passenger_wallet_id, 'ride_payment', -v_trip.agreed_fare, p_trip_id, 'Ride payment');
    insert into payments (trip_id, method, amount, status) values (p_trip_id, 'wallet', v_trip.agreed_fare, 'completed');
  else
    -- cash and other methods are settled outside the wallet ledger; this
    -- row still exists for reconciliation and for the passenger's receipt.
    insert into payments (trip_id, method, amount, status) values (p_trip_id, v_trip.payment_method, v_trip.agreed_fare, 'completed');
  end if;

  update partners set total_trips = total_trips + 1 where id = v_trip.partner_id;
  perform refresh_passenger_credit_limit(v_trip.passenger_id);
end;
$$ language plpgsql security definer;

comment on function complete_trip is
  'Settles both sides: partner is paid out (minus platform fee) via trip_earning/platform_service_fee, and — new in 0016 — the passenger is actually charged when payment_method = wallet, which is the enforcement point for their credit_limit (an insufficient-balance passenger with credit remaining goes negative here, not before).';

-- ---------------------------------------------------------------------
-- route pay_insurance_premium() through the centralized ledger too, so
-- the withdrawable/credit invariants stay correct after this migration.
-- ---------------------------------------------------------------------
create or replace function pay_insurance_premium(
  p_policy_id uuid,
  p_method payment_method,
  p_period_start date,
  p_period_end date
) returns uuid as $$
declare
  v_policy insurance_policies;
  v_wallet_id uuid;
  v_wallet_txn_id uuid;
  v_payment_id uuid;
begin
  select * into v_policy from insurance_policies where id = p_policy_id for update;
  if v_policy is null or v_policy.partner_id <> auth.uid() then
    raise exception 'policy not found or not yours';
  end if;

  if p_method = 'wallet' then
    select id into v_wallet_id from wallets where owner_id = auth.uid();
    perform apply_wallet_transaction(
      v_wallet_id, 'insurance_premium', -v_policy.monthly_premium, null,
      'Motions premium — ' || to_char(p_period_start, 'DD Mon') || ' to ' || to_char(p_period_end, 'DD Mon')
    );
    select id into v_wallet_txn_id from wallet_transactions
      where wallet_id = v_wallet_id order by created_at desc limit 1;
  end if;

  insert into insurance_premium_payments (
    policy_id, partner_id, period_start, period_end, amount, method, status, wallet_transaction_id
  ) values (
    p_policy_id, auth.uid(), p_period_start, p_period_end, v_policy.monthly_premium,
    p_method, 'completed', v_wallet_txn_id
  ) returning id into v_payment_id;

  return v_payment_id;
end;
$$ language plpgsql security definer;

grant execute on function
  record_wallet_topup(numeric, payment_method),
  withdraw_funds(numeric, payment_method),
  send_wallet_funds(numeric, text, uuid, text),
  refresh_passenger_credit_limit(uuid)
  to authenticated;
