-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- HEXIS AI GOVERNANCE PLATFORM — EVIDENCE FRAMEWORK
-- Migration: 004_evidence_framework
-- Date: 2026-04-12
-- Purpose: Evidence management for obligations — audit-ready
--          Supports checklist items + file/link attachments
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- ┌─────────────────────────────────┐
-- │  1. EVIDENCE ITEMS (checklist)  │
-- └─────────────────────────────────┘
-- Per-obligation checklist: concrete steps to demonstrate compliance.
-- Can be AI-generated (from Get Guidance) or user-created.

create table public.evidence_items (
  id uuid primary key default gen_random_uuid(),
  obligation_id uuid not null references public.obligations(id) on delete cascade,
  title text not null,
  description text,
  is_completed boolean not null default false,
  completed_at timestamptz,
  completed_by uuid references public.profiles(id),
  -- Source tracking
  source text not null default 'user'
    check (source in ('user', 'ai_suggested', 'template')),
  ai_model text,                        -- model that generated it (if ai_suggested)
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_evidence_items_obligation on public.evidence_items(obligation_id);

-- Auto-update updated_at
create trigger on_evidence_items_updated
  before update on public.evidence_items
  for each row execute function public.handle_updated_at();

-- ┌─────────────────────────────────┐
-- │  2. EVIDENCE ATTACHMENTS        │
-- └─────────────────────────────────┘
-- File uploads or external links attached as compliance evidence.
-- Supports both Supabase Storage files and external URLs.

create table public.evidence_attachments (
  id uuid primary key default gen_random_uuid(),
  obligation_id uuid not null references public.obligations(id) on delete cascade,
  evidence_item_id uuid references public.evidence_items(id) on delete set null,
  -- File or link
  attachment_type text not null
    check (attachment_type in ('file', 'link')),
  file_name text not null,              -- display name
  file_type text,                       -- MIME type (for files)
  file_size integer,                    -- bytes (for files)
  storage_path text,                    -- Supabase Storage path (for files)
  external_url text,                    -- URL (for links)
  -- Metadata
  description text,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create index idx_evidence_attachments_obligation on public.evidence_attachments(obligation_id);
create index idx_evidence_attachments_item on public.evidence_attachments(evidence_item_id);

-- ┌─────────────────────────────────┐
-- │  3. OBLIGATION EVIDENCE SUMMARY │
-- └─────────────────────────────────┘
-- Denormalized counters on obligations table for dashboard queries.
-- Avoids expensive JOINs on list views.

alter table public.obligations
  add column if not exists evidence_items_total integer not null default 0,
  add column if not exists evidence_items_completed integer not null default 0,
  add column if not exists evidence_attachments_count integer not null default 0;

-- ┌─────────────────────────────────┐
-- │  4. ROW LEVEL SECURITY          │
-- └─────────────────────────────────┘

-- EVIDENCE ITEMS
alter table public.evidence_items enable row level security;

create policy "Users can manage own org evidence items"
  on public.evidence_items for all
  using (exists (
    select 1
    from public.obligations o
    join public.ai_systems s on s.id = o.system_id
    where o.id = evidence_items.obligation_id
    and s.org_id = public.get_user_org_id()
  ));

-- EVIDENCE ATTACHMENTS
alter table public.evidence_attachments enable row level security;

create policy "Users can manage own org evidence attachments"
  on public.evidence_attachments for all
  using (exists (
    select 1
    from public.obligations o
    join public.ai_systems s on s.id = o.system_id
    where o.id = evidence_attachments.obligation_id
    and s.org_id = public.get_user_org_id()
  ));

-- ┌─────────────────────────────────┐
-- │  5. COUNTER UPDATE TRIGGERS     │
-- └─────────────────────────────────┘
-- Keeps obligations.evidence_items_total/_completed/_attachments_count in sync.

-- 5a. Evidence items counter
create or replace function public.update_evidence_item_counts()
returns trigger as $$
declare
  target_obligation_id uuid;
begin
  -- Determine which obligation_id to update
  if TG_OP = 'DELETE' then
    target_obligation_id := OLD.obligation_id;
  else
    target_obligation_id := NEW.obligation_id;
  end if;

  update public.obligations
  set
    evidence_items_total = (
      select count(*) from public.evidence_items
      where obligation_id = target_obligation_id
    ),
    evidence_items_completed = (
      select count(*) from public.evidence_items
      where obligation_id = target_obligation_id and is_completed = true
    )
  where id = target_obligation_id;

  -- If obligation_id changed on UPDATE, also recalc the old one
  if TG_OP = 'UPDATE' and OLD.obligation_id != NEW.obligation_id then
    update public.obligations
    set
      evidence_items_total = (
        select count(*) from public.evidence_items
        where obligation_id = OLD.obligation_id
      ),
      evidence_items_completed = (
        select count(*) from public.evidence_items
        where obligation_id = OLD.obligation_id and is_completed = true
      )
    where id = OLD.obligation_id;
  end if;

  return coalesce(NEW, OLD);
end;
$$ language plpgsql security definer;

create trigger on_evidence_item_change
  after insert or update or delete on public.evidence_items
  for each row execute function public.update_evidence_item_counts();

-- 5b. Evidence attachments counter
create or replace function public.update_evidence_attachment_counts()
returns trigger as $$
declare
  target_obligation_id uuid;
begin
  if TG_OP = 'DELETE' then
    target_obligation_id := OLD.obligation_id;
  else
    target_obligation_id := NEW.obligation_id;
  end if;

  update public.obligations
  set evidence_attachments_count = (
    select count(*) from public.evidence_attachments
    where obligation_id = target_obligation_id
  )
  where id = target_obligation_id;

  if TG_OP = 'UPDATE' and OLD.obligation_id != NEW.obligation_id then
    update public.obligations
    set evidence_attachments_count = (
      select count(*) from public.evidence_attachments
      where obligation_id = OLD.obligation_id
    )
    where id = OLD.obligation_id;
  end if;

  return coalesce(NEW, OLD);
end;
$$ language plpgsql security definer;

create trigger on_evidence_attachment_change
  after insert or update or delete on public.evidence_attachments
  for each row execute function public.update_evidence_attachment_counts();

-- ┌─────────────────────────────────┐
-- │  6. STORAGE BUCKET              │
-- └─────────────────────────────────┘
-- Supabase Storage bucket for evidence file uploads.
-- Max 10MB per file, common document types only.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'evidence',
  'evidence',
  false,
  10485760,  -- 10MB
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/png',
    'image/jpeg',
    'text/plain',
    'text/csv'
  ]
)
on conflict (id) do nothing;

-- Storage RLS: org-scoped access via path prefix
-- Path format: {org_id}/{system_id}/{obligation_id}/{filename}
create policy "Users can upload evidence to own org"
  on storage.objects for insert
  with check (
    bucket_id = 'evidence'
    and (storage.foldername(name))[1]::uuid = public.get_user_org_id()
  );

create policy "Users can view own org evidence"
  on storage.objects for select
  using (
    bucket_id = 'evidence'
    and (storage.foldername(name))[1]::uuid = public.get_user_org_id()
  );

create policy "Users can delete own org evidence"
  on storage.objects for delete
  using (
    bucket_id = 'evidence'
    and (storage.foldername(name))[1]::uuid = public.get_user_org_id()
  );
