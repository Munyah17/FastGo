-- FastGo schema — 0020: fare-adjustment claims for destination
-- misdirection.
--
-- The abuse pattern: a passenger states a nearby, cheap landmark as their
-- destination to get a lower negotiated fare, then directs the partner to
-- their real (further) destination once underway — the agreed fare never
-- adjusts because it was locked in against the stated dropoff, not the
-- real one. Mirrors the cancellation-fraud detector's philosophy: GPS
-- evidence decides, not anyone's say-so. The 100m threshold is the
-- explicit eligibility bar — normal pin-drop imprecision stays well under
-- that, so it doesn't create disputes over ordinary GPS noise.

create table fare_adjustment_claims (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null unique references trips (id),
  partner_id uuid not null references partners (id),
  declared_dropoff geography(point, 4326) not null,
  actual_dropoff geography(point, 4326) not null,
  discrepancy_m numeric not null,
  extra_fare numeric(10, 2) not null,
  status text not null default 'approved' check (status in ('submitted', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

comment on table fare_adjustment_claims is
  'One claim per trip, filed by the partner after completion. extra_fare is computed and (if > 0) settled automatically — see file_fare_adjustment_claim(). status stays as an audit/dispute field even though resolution is automatic today, so a future manual-review step has somewhere to write to.';

create index fare_adjustment_claims_partner_id_idx on fare_adjustment_claims (partner_id);

alter table fare_adjustment_claims enable row level security;

create policy fare_adjustment_claims_select_own on fare_adjustment_claims
  for select using (
    partner_id = auth.uid()
    or exists (select 1 from trips where id = trip_id and passenger_id = auth.uid())
  );

grant select on fare_adjustment_claims to authenticated;

create function file_fare_adjustment_claim(p_trip_id uuid) returns uuid as $$
declare
  v_trip trips;
  v_actual_point geography;
  v_discrepancy numeric;
  v_original_km numeric;
  v_actual_km numeric;
  v_extra_fare numeric;
  v_service_fee numeric;
  v_claim_id uuid;
  v_partner_wallet_id uuid;
  v_passenger_wallet_id uuid;
begin
  select * into v_trip from trips where id = p_trip_id for update;
  if v_trip is null or v_trip.partner_id <> auth.uid() then
    raise exception 'trip not found or not yours';
  end if;
  if v_trip.status <> 'completed' then
    raise exception 'trip must be completed before filing a fare adjustment claim';
  end if;
  if exists (select 1 from fare_adjustment_claims where trip_id = p_trip_id) then
    raise exception 'a claim already exists for this trip';
  end if;

  select location into v_actual_point from trip_locations
    where trip_id = p_trip_id order by recorded_at desc limit 1;
  if v_actual_point is null then
    raise exception 'no GPS evidence available for this trip';
  end if;

  v_discrepancy := st_distance(v_actual_point, v_trip.dropoff_location);
  if v_discrepancy <= 100 then
    raise exception 'the discrepancy (%.0fm) is below the 100m eligibility threshold', v_discrepancy;
  end if;

  -- Heuristic: 1.3x the straight-line pickup->declared-dropoff distance as
  -- a rough road-network estimate (no stored original route distance to
  -- compare against, since FastGo negotiates flat fares, not metered
  -- ones). Extra fare scales the agreed fare by how much further the
  -- actual trip ran versus that estimate, capped at 2x the original fare
  -- as a sanity bound.
  v_original_km := greatest(st_distance(v_trip.pickup_location, v_trip.dropoff_location) / 1000.0 * 1.3, 0.5);
  v_actual_km := coalesce(v_trip.distance_km, v_original_km);
  v_extra_fare := round(
    least(v_trip.agreed_fare * greatest(0, (v_actual_km - v_original_km) / v_original_km), v_trip.agreed_fare * 2),
    2
  );

  insert into fare_adjustment_claims (
    trip_id, partner_id, declared_dropoff, actual_dropoff, discrepancy_m, extra_fare, status, resolved_at
  ) values (
    p_trip_id, auth.uid(), v_trip.dropoff_location, v_actual_point, v_discrepancy, v_extra_fare, 'approved', now()
  ) returning id into v_claim_id;

  if v_extra_fare > 0 then
    v_service_fee := round(v_extra_fare * 0.15, 2);
    select id into v_partner_wallet_id from wallets where owner_id = v_trip.partner_id;
    select id into v_passenger_wallet_id from wallets where owner_id = v_trip.passenger_id;

    perform apply_wallet_transaction(
      v_partner_wallet_id, 'trip_earning', v_extra_fare - v_service_fee, p_trip_id,
      'Fare adjustment — destination discrepancy claim'
    );
    perform apply_wallet_transaction(
      v_passenger_wallet_id, 'ride_payment', -v_extra_fare, p_trip_id,
      'Fare adjustment — actual destination differed from declared by ' || round(v_discrepancy) || 'm'
    );
  end if;

  return v_claim_id;
end;
$$ language plpgsql security definer;

comment on function file_fare_adjustment_claim is
  'Settles through apply_wallet_transaction() same as any other charge — including the passenger credit_limit guard, so a passenger without enough spare balance still gets billed up to their limit, not blocked entirely.';

revoke execute on function file_fare_adjustment_claim(uuid) from public;
grant execute on function file_fare_adjustment_claim(uuid) to authenticated;
