-- Migration: create store table
CREATE TABLE IF NOT EXISTS store (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT,
  items JSONB NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  total_amount NUMERIC(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  reference TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
