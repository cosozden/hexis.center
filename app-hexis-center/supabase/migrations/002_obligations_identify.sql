-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- HEXIS AI GOVERNANCE PLATFORM — OBLIGATIONS IDENTIFY
-- Migration: 002_obligations_identify
-- Date: 2026-03-28
-- Purpose: Add obligation_key, applies_to, guidance_cache
--          to support ORIENT Identify stage role-based filtering
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- 1. obligation_key: unique identifier for upsert (prevents duplicate seeding)
alter table public.obligations
  add column if not exists obligation_key text;

-- Unique per system: same obligation_key can exist across systems, but not within one
create unique index if not exists idx_obligations_system_key
  on public.obligations(system_id, obligation_key);

-- 2. applies_to: tracks which organisation role this obligation targets
alter table public.obligations
  add column if not exists applies_to text not null default 'all'
    check (applies_to in ('provider', 'deployer', 'all'));

-- 3. guidance_cache: cached Claude guidance for "Get Guidance" feature
alter table public.obligations
  add column if not exists guidance_cache jsonb;

-- 4. updated_at: track last status change
alter table public.obligations
  add column if not exists updated_at timestamptz not null default now();

-- Auto-update updated_at on status change
create trigger on_obligations_updated
  before update on public.obligations
  for each row execute function public.handle_updated_at();
