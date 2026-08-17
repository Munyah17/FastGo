-- FastGo schema — 0022: Scan-to-Pay cashback.
--
-- The scenario: a passenger paid cash and is owed change, but the driver
-- doesn't have exact coins/notes. Instead of shortchanging the passenger
-- (or the driver eating the loss), the driver scans the passenger's QR
-- code and sends the change digitally — keeping 5% as a handling fee for
-- the convenience, since they're not physically handing back that cash at
-- all (they keep 100% of what they were holding). This is entirely
-- separate from send_wallet_funds()'s general P2P transfer: it's driver-
-- initiated (never a passenger demand — see the "not mandatory" framing
-- below), and it deliberately doesn't touch the driver's withdrawable
-- earnings at all, since no wallet debit happens on the driver's side.
--
-- General Scan-to-Pay transfers (driver-driver, passenger-driver,
-- passenger-passenger, all by scanning a QR that just encodes a profile
-- id) need no new function at all — send_wallet_funds() from 0016 already
-- handles any sender/recipient role combination correctly via the
-- provenance check (only non-withdrawable balance is ever transferable),
-- so a driver whose funds are entirely trip earnings still can't move them
-- out this way, exactly as intended.

-- cashback_fee behaves like trip_earning for withdrawability purposes: the
-- driver actually performed a service (instant digital change) and earned
-- the 5% fee for it.
create or replace function apply_wallet_transaction(
  p_wallet_id uuid,
  p_type wallet_txn_type,
  p_amount numeric,
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
  if p_type in ('trip_earning', 'cashback_fee') then
    v_new_withdrawable := v_new_withdrawable + p_amount;
  elsif p_type = 'withdrawal' then
    v_new_withdrawable := v_new_withdrawable + p_amount; -- p_amount negative here
  end if;
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

create function give_cashback(p_passenger_id uuid, p_cash_amount numeric, p_trip_id uuid default null) returns void as $$
declare
  v_driver_wallet_id uuid;
  v_passenger_wallet_id uuid;
  v_fee numeric;
  v_payout numeric;
begin
  if p_cash_amount <= 0 then
    raise exception 'cashback amount must be positive';
  end if;
  if not exists (select 1 from partners where id = auth.uid() and status = 'active') then
    raise exception 'only active partners can give cashback';
  end if;
  if p_passenger_id = auth.uid() then
    raise exception 'cannot give cashback to yourself';
  end if;

  v_fee := round(p_cash_amount * 0.05, 2);
  v_payout := p_cash_amount - v_fee;

  select id into v_driver_wallet_id from wallets where owner_id = auth.uid();
  select id into v_passenger_wallet_id from wallets where owner_id = p_passenger_id;
  if v_passenger_wallet_id is null then
    raise exception 'recipient wallet not found';
  end if;

  perform apply_wallet_transaction(
    v_passenger_wallet_id, 'cashback_received', v_payout, p_trip_id,
    format('Cash change from driver via Scan to Pay (US$%s of US$%s, 5%% retained)', v_payout, p_cash_amount)
  );
  perform apply_wallet_transaction(
    v_driver_wallet_id, 'cashback_fee', v_fee, p_trip_id,
    format('Cashback handling fee (5%% of US$%s)', p_cash_amount)
  );
end;
$$ language plpgsql security definer;

comment on function give_cashback is
  'Driver-initiated only, by construction (auth.uid() must be an active partner) — a passenger can ask, but nothing here lets them compel it. No debit on the driver''s side: they keep the physical cash entirely and this just credits the passenger 95% of it digitally plus the driver 5%, net new money into the system rather than a transfer out of the driver''s existing balance.';

revoke execute on function give_cashback(uuid, numeric, uuid) from public;
grant execute on function give_cashback(uuid, numeric, uuid) to authenticated;
