-- FastGo schema — 0015: new wallet ledger types for P2P transfers.
-- Own migration: ALTER TYPE ... ADD VALUE can't run in the same
-- transaction as code that references the new value (same constraint
-- that split 0010 from 0011).

alter type wallet_txn_type add value 'p2p_send';
alter type wallet_txn_type add value 'p2p_receive';
alter type wallet_txn_type add value 'ride_payment';
alter type wallet_txn_type add value 'ride_refund';
