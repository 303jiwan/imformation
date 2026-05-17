-- Migration: 20260518_wallet_shop.sql
-- Run this in Supabase Dashboard → SQL Editor (or psql).
-- Safe to re-run (all statements are idempotent via IF NOT EXISTS / ON CONFLICT).

-- 1. 지갑 (1 row per user)
CREATE TABLE IF NOT EXISTS user_wallet (
  user_id    BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  balance    INT NOT NULL DEFAULT 0 CHECK (balance >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. 소유 아이템 (uniqueness 보장)
CREATE TABLE IF NOT EXISTS user_owned_items (
  user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id     TEXT   NOT NULL,
  acquired_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, item_id)
);

-- 3. 문제별 최초 보상 멱등 마커. (user_id, problem_id) PK가 grant 진리.
CREATE TABLE IF NOT EXISTS problem_awards (
  user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id  TEXT   NOT NULL,
  amount      INT    NOT NULL,
  awarded_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, problem_id)
);
