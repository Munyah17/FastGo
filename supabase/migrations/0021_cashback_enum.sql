-- FastGo schema — 0021: new wallet ledger types for Scan-to-Pay cashback.
-- Own migration: ALTER TYPE ... ADD VALUE can't run in the same
-- transaction as code that references the new value.

alter type wallet_txn_type add value 'cashback_received';
alter type wallet_txn_type add value 'cashback_fee';
