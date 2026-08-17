-- FastGo schema — 0011: Motions insurance premium payments
--
-- Partners pay their own Motions Microinsurance premium (legal aid +
-- comprehensive cover) in-app, from their FastGo wallet balance or another
-- payment method. This is billing between the partner and their insurer,
-- facilitated by FastGo — not FastGo charging the partner rent for a
-- vehicle or salary deduction.

create table insurance_premium_payments (
  id uuid primary key default gen_random_uuid(),
  policy_id uuid not null references insurance_policies (id) on delete cascade,
  partner_id uuid not null references partners (id),
  period_start date not null,
  period_end date not null,
  amount numeric(10, 2) not null,
  method payment_method not null,
  status payment_status not null default 'completed',
  wallet_transaction_id uuid references wallet_transactions (id),
  created_at timestamptz not null default now()
);

comment on table insurance_premium_payments is
  'Billing history for Motions premium payments. Written only by pay_insurance_premium() below — never directly by the client.';

create index insurance_premium_payments_partner_id_idx on insurance_premium_payments (partner_id, created_at desc);

create function pay_insurance_premium(
  p_policy_id uuid,
  p_method payment_method,
  p_period_start date,
  p_period_end date
) returns uuid as $$
declare
  v_policy insurance_policies;
  v_wallet wallets;
  v_wallet_txn_id uuid;
  v_payment_id uuid;
begin
  select * into v_policy from insurance_policies where id = p_policy_id for update;
  if v_policy is null or v_policy.partner_id <> auth.uid() then
    raise exception 'policy not found or not yours';
  end if;

  if p_method = 'wallet' then
    select * into v_wallet from wallets where owner_id = auth.uid() for update;
    if v_wallet.balance < v_policy.monthly_premium then
      raise exception 'insufficient wallet balance — top up before paying this premium';
    end if;

    insert into wallet_transactions (wallet_id, type, amount, description)
    values (
      v_wallet.id, 'insurance_premium', -v_policy.monthly_premium,
      'Motions premium — ' || to_char(p_period_start, 'DD Mon') || ' to ' || to_char(p_period_end, 'DD Mon')
    ) returning id into v_wallet_txn_id;

    update wallets set balance = balance - v_policy.monthly_premium, updated_at = now()
    where id = v_wallet.id;
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

alter table insurance_premium_payments enable row level security;

create policy "insurance_premium_payments: read own" on insurance_premium_payments
  for select using (partner_id = auth.uid());

grant select on insurance_premium_payments to authenticated;

revoke execute on function pay_insurance_premium(uuid, payment_method, date, date) from public;
grant execute on function pay_insurance_premium(uuid, payment_method, date, date) to authenticated;
