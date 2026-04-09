-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- HEXIS AI GOVERNANCE PLATFORM — GOVOPS FOUNDATION
-- Migration: 003_govops_foundation
-- Date: 2026-04-09
-- Purpose: GovOps (Era 2) minimal foundation —
--          governance_events audit trail + next_review_date on ai_systems
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- ┌─────────────────────────────────┐
-- │  1. GOVERNANCE EVENTS           │
-- │     Immutable audit trail       │
-- └─────────────────────────────────┘
--
-- Every significant change in the ORIENT lifecycle produces an event.
-- Events are IMMUTABLE — INSERT only, no UPDATE or DELETE.
-- This is the backbone of GovOps: event-driven governance.

create table public.governance_events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  system_id uuid not null references public.ai_systems(id) on delete cascade,
  event_type text not null,
  orient_step text not null
    check (orient_step in ('observe', 'risk', 'identify', 'evaluate', 'navigate', 'track')),
  actor_id uuid references public.profiles(id),
  previous_value jsonb,
  new_value jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Performance indexes
create index idx_governance_events_org on public.governance_events(org_id);
create index idx_governance_events_system on public.governance_events(system_id);
create index idx_governance_events_type on public.governance_events(event_type);
create index idx_governance_events_step on public.governance_events(orient_step);
create index idx_governance_events_date on public.governance_events(created_at);

-- Composite index for common query: "events for this system, newest first"
create index idx_governance_events_system_date
  on public.governance_events(system_id, created_at desc);

comment on table public.governance_events is
  'Immutable audit trail for ORIENT lifecycle events. INSERT only — no UPDATE or DELETE.';

-- ┌─────────────────────────────────┐
-- │  2. KNOWN EVENT TYPES           │
-- └─────────────────────────────────┘
--
-- Reference (not enforced via CHECK to allow future extensibility):
--   system_created          — new AI system registered (observe)
--   system_updated          — system details changed (observe)
--   classification_created  — risk classification assigned (risk)
--   classification_changed  — risk level changed (risk)
--   obligation_seeded       — obligations auto-generated (identify)
--   obligation_status_changed — obligation marked complete/in_progress (identify)
--   assessment_created      — governance matrix assessment (evaluate)
--   action_created          — action plan generated (navigate)
--   action_status_changed   — action completed/started (navigate)
--   snapshot_created        — compliance snapshot taken (track)
--   report_generated        — compliance report produced (track)
--   invalidation_triggered  — upstream change invalidated downstream steps
--   review_scheduled        — next review date set or updated

-- ┌─────────────────────────────────┐
-- │  3. NEXT REVIEW DATE            │
-- │     Added to ai_systems         │
-- └─────────────────────────────────┘

alter table public.ai_systems
  add column if not exists next_review_date date;

alter table public.ai_systems
  add column if not exists review_frequency_days integer default 90;

comment on column public.ai_systems.next_review_date is
  'Next scheduled governance review. Null = no review scheduled.';

comment on column public.ai_systems.review_frequency_days is
  'Days between governance reviews. Default 90 (quarterly). Used to auto-schedule next review after completion.';

-- ┌─────────────────────────────────┐
-- │  4. INVALIDATION STATUS         │
-- │     Added to ai_systems         │
-- └─────────────────────────────────┘
--
-- Tracks which ORIENT steps are currently "stale" due to upstream changes.
-- JSON array of step names, e.g. ["identify", "evaluate", "navigate", "track"]
-- Empty array = all steps current.

alter table public.ai_systems
  add column if not exists invalidated_steps text[] not null default '{}';

comment on column public.ai_systems.invalidated_steps is
  'ORIENT steps currently marked stale due to upstream changes. Empty = all current.';

-- ┌─────────────────────────────────┐
-- │  5. RLS — GOVERNANCE EVENTS     │
-- └─────────────────────────────────┘
--
-- Immutable: SELECT + INSERT only. No UPDATE, no DELETE.

alter table public.governance_events enable row level security;

-- SELECT: users can view events for their org
create policy "Users can view own org events"
  on public.governance_events for select
  using (org_id = public.get_user_org_id());

-- INSERT: users can create events for their org
create policy "Users can insert own org events"
  on public.governance_events for insert
  with check (org_id = public.get_user_org_id());

-- NO UPDATE policy — events are immutable
-- NO DELETE policy — events are immutable

-- ┌─────────────────────────────────┐
-- │  6. SNAPSHOT METADATA UPGRADE   │
-- └─────────────────────────────────┘
--
-- Add score_breakdown to compliance_snapshots for detailed tracking.
-- The score-engine calculates component scores; store them for trend analysis.

alter table public.compliance_snapshots
  add column if not exists score_breakdown jsonb;

comment on column public.compliance_snapshots.score_breakdown is
  'Detailed score components: {obligations, actions, governance, orient_progress, risk_multiplier}';
