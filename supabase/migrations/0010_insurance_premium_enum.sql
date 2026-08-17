-- FastGo schema — 0010: add insurance_premium to the wallet ledger enum
--
-- Split into its own migration because ALTER TYPE ... ADD VALUE cannot be
-- used in the same transaction as a statement that references the new
-- value (Postgres restriction) — the table/function that use it live in
-- 0011_insurance_premiums.sql.

alter type wallet_txn_type add value 'insurance_premium';
