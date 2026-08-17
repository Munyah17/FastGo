# FastGo

Zimbabwe-first digital mobility and ride-hailing platform. FastGo is a **technology company** — it intermediates, verifies, and provides safety tooling for ride-sharing between independent partners (drivers/car owners sharing their own vehicle, on their own terms) and passengers. It does not own vehicles, employ partners, or provide transportation itself. See [docs/POSITIONING.md](docs/POSITIONING.md) for the full framing — every screen, table and RPC in this repo follows it.

This repository contains three things:

1. A mobile-first **Next.js UI prototype** with mock data (`src/app/(app)/`) — the driver/passenger consumer app
2. A desktop-first **admin/ops portal** (`src/app/admin/`) — internal tooling, not customer-facing
3. A validated **Supabase/Postgres schema** for the real backend (`supabase/`)

## Run the app

```bash
npm install
npm run dev
```

- Consumer app: **http://localhost:47613** — a true mobile experience below the `md` breakpoint (edge-to-edge, no chrome); on tablet/desktop it renders as a centered, capped-height phone frame rather than stretching a phone layout across the whole screen.
- Admin portal: **http://localhost:47613/admin** — desktop-first sidebar/topbar shell, not wrapped in the phone frame.

Both live in the same Next.js app/codebase, split via an `(app)` route group (`src/app/(app)/layout.tsx` owns the phone-frame shell + bottom nav) so the root layout stays a thin `<html><body>` shared by both.

> Dev/start ports are pinned to `47613` in `package.json` — this machine keeps `3000-4000` reserved for other projects and other local Supabase stacks already occupy the default `54321-54329` range, so every FastGo service uses an odd, dedicated port block instead. See the port table below before running anything else locally.

## Screens

The app has two lenses on the same profile — requesting a ride (passenger) and sharing your own ride (partner) — matching the `is_passenger` / `is_partner` flags on `profiles` in the schema. A **Ride | Drive** toggle (`src/components/ModeToggle.tsx`, state in `src/lib/ModeContext.tsx`, persisted to `localStorage`) switches Home between the two: Passenger mode is the map-first booking screen; Driver mode is a go-online switch plus a live queue of incoming ride-request bids (accept the offered fare, counter it, or ignore — the "Bidding page" of the inDrive-style negotiation model). Bottom nav is `Wallet | Trips | Home (elevated, centered) | Messages | Profile`.

| Route | Screen |
|---|---|
| `/` | Home — mode-dependent: Passenger = map-first landing (inDrive-style) with live map, destination search, saved-place chips, inline fare offer; Driver = online toggle + incoming bid requests |
| `/book/search`, `/book/search/map` | Destination search — autocomplete suggestions, "Use current location", pick-a-pin-on-map |
| `/onboarding`, `/auth`, `/auth/verify` | Passenger intro slides, phone sign-in, OTP verification |
| `/book` → `/searching` → `/ride` → `/ride/complete` | Full ride lifecycle: fixed-tier request, match, active trip, rating |
| `/trips`, `/trips/detail` | Trip History (partner's completed rides, grouped by day) + receipt detail |
| `/wallet`, `/wallet/topup`, `/wallet/transactions`, `/wallet/withdraw` | Wallet balance, top up (EcoCash/Steward Bank/Paynow Zimbabwe/OneMoney/card), transaction ledger, withdraw |
| `/earnings`, `/earnings/history` | Earnings Overview (daily/weekly/monthly) + statement history |
| `/incentives` | Weekly challenge progress, active bonuses, incentive history |
| `/protection`, `/insurance`, `/insurance/pay` | Legal Aid Cover (Motions) — policy + billing history, **pay premium from wallet balance** |
| `/profile`, `/settings`, `/documents`, `/vehicle` | Profile & stats, settings, document compliance list, My Vehicle |
| `/verification`, `/onboarding/partner/*` | Driver Verification status + 6-step partner onboarding wizard (personal → licence → vehicle → documents → insurance → review) |
| `/verification/passenger`, `/onboarding/passenger/*` | **Rider Verification** — passengers go through equivalent-but-relevant KYC too (ID + selfie, ID document upload, emergency contact, review): drivers aren't the only ones at risk, riders can be used as cover by people robbing drivers |
| `/safety`, `/safety/contacts`, `/safety/report` | Safety Center, SOS, trusted contacts, incident reporting |
| `/help`, `/help/faqs` | Help & Support, FAQs |
| `/messages`, `/messages/chat` | Messages inbox + trip chat thread |
| `/notifications` | Notifications (All/Trips/Promotions/Alerts) |
| `/refer` | Refer & Earn — referral code, invited/active/earned stats |

Insurance/legal-cover copy deliberately avoids "protection" language — see [[fastgo-legal-positioning]] in memory: it's "Legal Aid Cover" (legal aid + comprehensive cover), never "driver protection", "accident protection", or "release & recovery" — wording the user flagged as legally sensitive.

### Admin portal (`/admin/*`)

Desktop-first, not customer-facing. Sidebar nav: Overview, Partners, Passengers, Trips, Compliance, Safety, Councils. Partner detail pages surface the same `compliance_events` audit trail the schema is built around, plus a Suspend/Reinstate action stubbed to match `sync_partner_compliance()`'s real behavior (only a service-role caller can actually flip `partners.status`, per `0007_functions.sql`). Mock data lives in `src/lib/adminData.ts`, shaped to match the Supabase tables directly.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS v4** — design tokens in `src/app/globals.css` (`brand`, `good`, `bad`, `warn`, `page`, `ink`, `sub`, `line`)
- Hand-drawn inline SVG icon set (`src/components/Icons.tsx`) — no icon library dependency
- Mock data centralized in `src/lib/data.ts` — the screens still run on this; the Supabase client (below) is wired but not yet swapped in
- Mock map (`src/components/MapMock.tsx`) — to be replaced with MapLibre GL + a routing provider
- `@supabase/supabase-js` + `@supabase/ssr` client helpers in `src/lib/supabase/`

## Backend: Supabase schema

The schema in `supabase/migrations/` is a validated, from-scratch marketplace data model — every migration has been applied against a real local Postgres via `supabase db reset` (not just written and hoped for).

### Two-layer design (matches docs/POSITIONING.md)

- **Technical tables** — `profiles`, `partners`, `vehicles`, `ride_requests`/`ride_offers` (inDrive-style negotiation), `trips`, `wallets`/`wallet_transactions`, `sos_events`, `messages`.
- **Compliance-as-code, not paperwork** — `councils`, `council_rules` (configurable per-council requirements, not hard-coded), `partner_documents` with a derived (never stored) expiry status, and an append-only `compliance_events` audit trail a partner can always read about themselves — the "protect partners from arbitrary enforcement" part of the mission.

### Why mutations go through functions, not raw table writes

`trips`, `fares`, `payments`, `wallet_transactions`, and `partners.status` have **no client-facing UPDATE policy**. Every state change goes through a `SECURITY DEFINER` function instead:

- `accept_ride_offer()` — passenger accepts one offer, atomically creates the trip, declines the rest
- `start_trip()` / `complete_trip()` / `cancel_trip()` — trip lifecycle; `complete_trip()` writes the `fares` row and settles the partner's wallet in one transaction
- `pay_insurance_premium()` — pays a partner's Motions premium from their wallet balance (or records another method), same pattern as trip settlement
- `sync_partner_compliance()` — walks document expiry and suspends/reinstates partners; scheduled nightly via `pg_cron` where available
- `find_nearby_open_requests()` — partners never `SELECT` `ride_requests` directly (that would leak every passenger's pickup location); they call this instead
- `flag_low_rating()` — a rating ≤2 opens a `manual_review` compliance event, **never** an automatic suspension

This means a partner can't self-reinstate after a suspension, a passenger can't rewrite a fare after the fact, and every balance change has an auditable cause.

### Cancellation-fraud prevention (`0012`)

`complete_trip()`'s platform service fee is deducted from the partner's payout, not added to the passenger's fare — which creates an incentive for a partner to cancel *after* seeing the pickup/passenger and dodge the fee entirely. `cancel_trip()` now tracks this:

- Every partner-initiated cancellation logs a `manual_review` compliance event (passenger-initiated cancellations never count against a partner — cancelling isn't their fault).
- `count_recent_partner_cancellations()` counts a partner's own cancellations in a rolling window — tunable via `cancellation_strike_threshold()` (default 3) and `cancellation_strike_window()` (default 7 days), single-source-of-truth functions rather than magic numbers scattered across the codebase.
- Hitting the threshold auto-suspends the partner and logs a `partner_suspended` event pointing them to contact support — surfaced in the app as a visible strike counter on the Driver Mode home screen (`src/app/(app)/DriverHome.tsx`), not a silent ban.
- `SECURITY DEFINER` does **not** change `auth.role()` (that GUC reflects the original caller's session, not the function owner), so `cancel_trip()` calling `UPDATE partners SET status = 'suspended'` would otherwise be blocked by its own guard trigger. Trusted functions now call `set_config('fastgo.trusted_status_change', 'true', true)` (transaction-local) before writing `partners.status`; a raw client `UPDATE` still can't set that flag, so direct writes stay blocked. Both the strike system and the fee correction were verified against a real local Postgres with a scripted end-to-end test (3 cancellations → suspension with full audit trail; a US$10 trip → exactly US$1.50 fee), not just "the migration applied."

Further fraud vectors worth building out next, roughly in order of value: (1) weight cancellation timing — a cancel seconds after match is a stronger signal than one after several minutes of genuine driving toward pickup; (2) detect off-platform completion by checking whether `trip_locations` keeps recording plausible movement toward the dropoff *after* a partner cancels (a sign the trip happened anyway, off the books); (3) a required cancellation-reason picker in the UI, so "fare too low" selected repeatedly on high-value trips is itself a flaggable pattern, distinct from legitimate reasons like a no-show passenger.

### Running it locally

Requires Docker Desktop.

```bash
npx supabase start   # first run pulls images, takes a few minutes
```

Copy the `API_URL` and `ANON_KEY` it prints into `.env.local` (see `.env.example`) — or reuse the ones already checked into `.env.local` for this machine's local stack.

```bash
npx supabase db reset   # re-applies every migration + supabase/seed.sql from scratch
```

Studio UI: whatever `npx supabase status` reports for `STUDIO_URL`.

### Port allocation

Every FastGo local service is pinned to an odd, dedicated port — never `3000-4000`, and never the Supabase CLI defaults (`54321-54329`), which another project on this machine already occupies. Configured in `supabase/config.toml`.

| Service | Port |
|---|---|
| Next.js dev/start | `47613` |
| Supabase API (`NEXT_PUBLIC_SUPABASE_URL`) | `48221` |
| Postgres | `48222` |
| Shadow DB (`db diff`) | `48223` |
| Supabase Studio | `48224` |
| Inbucket/Mailpit (local email testing) | `48225` |
| Connection pooler (disabled by default) | `48229` |

Analytics/Logflare is disabled entirely in `config.toml` — not needed for schema work and it's one less container to conflict.

### Migration order

| File | Contents |
|---|---|
| `0001_extensions_enums.sql` | PostGIS, pgcrypto, every enum type |
| `0002_identity.sql` | `profiles`, `partners`, `vehicles`, `trusted_contacts`, `wallets` |
| `0003_compliance.sql` | `councils`, `council_rules`, `service_zones`, `partner_documents`, `compliance_events`, `insurance_policies` |
| `0004_rides.sql` | `ride_requests`, `ride_offers`, `trips`, `trip_locations` |
| `0005_payments.sql` | `fares`, `payments`, `wallet_transactions`, `incentives`, `incentive_progress` |
| `0006_safety_support.sql` | `ratings`, `sos_events`, `incident_reports`, `notifications`, `messages` |
| `0007_functions.sql` | Every `SECURITY DEFINER` function + trigger listed above |
| `0008_rls.sql` | Row-level security policies for every table |
| `0009_grants.sql` | Table/function `GRANT`s (RLS restricts rows; grants are what let PostgREST reach the table at all — newer Supabase CLI defaults stop auto-exposing new tables) |
| `0010_insurance_premium_enum.sql` | Adds `insurance_premium` to the wallet ledger enum (own migration — `ALTER TYPE ... ADD VALUE` can't share a transaction with code that uses the new value) |
| `0011_insurance_premiums.sql` | `insurance_premium_payments` + `pay_insurance_premium()` |
| `0012_cancellation_fraud_prevention.sql` | Corrects the platform service fee default, adds `trips.cancellation_reason`, and adds the cancellation-fraud strike system (see below) |

`supabase/seed.sql` seeds the six launch councils (Harare, Bulawayo, Chitungwiza, Mutare, Gweru, Victoria Falls) with placeholder baseline rules — **illustrative only**, not confirmed requirements; see the regulatory-discovery note below.

## Architecture direction (from the project brief)

1. **FastGo Core** — Node/TypeScript services: dispatch/matching, pricing (fixed-fare + inDrive-style offers), trip state, wallet/reconciliation, notifications. The Postgres functions above are the first slice of this; a thin API layer around them is the next step.
2. **Regulatory / Council Compliance Engine** — per-council operating rules, document expiry → automatic suspension, geofenced restrictions. Modeled in `0003_compliance.sql`.
3. **Payments** — EcoCash, OneMoney, Paynow Zimbabwe, Steward Bank, cards, and cash (with commission ledgering via the partner wallet), integrated through licensed payment service providers — FastGo is not a payment system itself.
4. **Safety** — SOS with GPS + trip context, trip sharing, PIN verification, auditable trip records balanced against the Cyber and Data Protection Act.

> **Note:** Nothing here is legal advice. Before accepting a paid ride, the licensing/permit structure for the platform, operators, drivers and vehicles must be validated with Zimbabwean transport counsel per launch council. Council rule values seeded in `supabase/seed.sql` are placeholders for prototype/demo purposes.
