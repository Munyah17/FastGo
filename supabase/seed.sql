-- FastGo — local dev seed data
-- Applied automatically by `supabase db reset`. Council rule values here are
-- illustrative placeholders for prototype/demo purposes only — the actual
-- per-council requirements must be confirmed with Zimbabwean transport
-- counsel before any council is activated for real launch (see
-- docs/POSITIONING.md and the brief's Phase 0 regulatory discovery step).

insert into councils (name, slug, province) values
  ('Harare',          'harare',         'Harare Province'),
  ('Bulawayo',        'bulawayo',       'Bulawayo Province'),
  ('Chitungwiza',     'chitungwiza',    'Harare Province'),
  ('Mutare',          'mutare',         'Manicaland'),
  ('Gweru',           'gweru',          'Midlands'),
  ('Victoria Falls',  'victoria-falls', 'Matabeleland North');

insert into council_rules (council_id, rule_key, rule_value, description)
select id, rule_key, rule_value, description
from councils
cross join (values
  ('requires_operator_permit', 'true'::jsonb,  'Partner must hold a current council operator permit before matching is enabled in this council.'),
  ('requires_driver_badge',    'true'::jsonb,  'Partner must display a council-issued driver badge/ID.'),
  ('designated_pickup_only',   'false'::jsonb, 'If true, pickups are restricted to designated ranks/zones rather than anywhere in the council area.'),
  ('council_fee_usd',          '0'::jsonb,     'Placeholder — actual council permit fee, to be confirmed per Model Fees By-laws and subsequent amendments.')
) as rules(rule_key, rule_value, description)
where councils.slug in ('harare', 'bulawayo', 'chitungwiza', 'mutare', 'gweru', 'victoria-falls');

insert into incentives (title, description, council_id, target_trips, reward_amount, starts_at, ends_at)
select
  'Peak-Hour Hero',
  'Complete 10 trips between 6-9AM this week',
  id,
  10,
  8.00,
  date_trunc('week', now()),
  date_trunc('week', now()) + interval '7 days'
from councils where slug = 'harare';

insert into incentives (title, description, council_id, target_trips, reward_amount, starts_at, ends_at)
select
  'Weekend Warrior',
  'Complete 25 trips Saturday-Sunday',
  id,
  25,
  15.00,
  date_trunc('week', now()) + interval '5 days',
  date_trunc('week', now()) + interval '7 days'
from councils where slug = 'harare';
