-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- HEXIS AI GOVERNANCE PLATFORM — INITIAL SCHEMA
-- Migration: 001_initial_schema
-- Date: 2026-03-27
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- ┌─────────────────────────────────┐
-- │  1. ORGANIZATIONS               │
-- └─────────────────────────────────┘

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  plan text not null default 'pro'
    check (plan in ('pro', 'business')),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  subscription_status text not null default 'trialing'
    check (subscription_status in ('trialing', 'active', 'past_due', 'canceled', 'unpaid')),
  trial_ends_at timestamptz,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Slug index for fast lookups
create unique index idx_organizations_slug on public.organizations(slug);

-- ┌─────────────────────────────────┐
-- │  2. PROFILES                    │
-- └─────────────────────────────────┘

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  org_id uuid references public.organizations(id) on delete set null,
  email text not null,
  full_name text,
  role text not null default 'owner'
    check (role in ('owner', 'admin', 'member')),
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_profiles_org on public.profiles(org_id);

-- ┌─────────────────────────────────┐
-- │  3. AI SYSTEMS (Observe)        │
-- └─────────────────────────────────┘

create table public.ai_systems (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  description text,
  purpose text,                         -- Claude API input: serbest metin → analiz
  provider text,                        -- sistem sağlayıcısı
  deployment_type text
    check (deployment_type in ('internal', 'external', 'both')),
  data_types text[] not null default '{}',
  processes_personal_data boolean default false,
  eu_market boolean not null default true,
  organisation_role text default 'deployer'
    check (organisation_role in ('provider', 'deployer', 'both')),
  deployment_status text not null default 'planning'
    check (deployment_status in ('planning', 'development', 'testing', 'production', 'retired')),
  responsible_person text,
  responsible_unit text,
  observe_metadata jsonb default '{}'::jsonb,  -- serbest yapı: ek alanlar
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_ai_systems_org on public.ai_systems(org_id);

-- ┌─────────────────────────────────┐
-- │  4. RISK CLASSIFICATIONS (Risk) │
-- └─────────────────────────────────┘

create table public.risk_classifications (
  id uuid primary key default gen_random_uuid(),
  system_id uuid not null references public.ai_systems(id) on delete cascade,
  risk_level text not null
    check (risk_level in ('prohibited', 'high', 'limited', 'gpai', 'minimal')),
  classification_path jsonb not null default '[]'::jsonb,
  article_references text[] not null default '{}',
  exception_applied boolean default false,
  exception_details text,
  -- Claude enrichment
  ai_insight jsonb,                     -- structured output: reasoning, edge_cases, etc.
  ai_confidence text
    check (ai_confidence in ('clearly_required', 'likely_applies', 'gray_area', 'seek_legal_counsel')),
  ai_model text,                        -- e.g. 'claude-haiku-4-5'
  classified_at timestamptz not null default now(),
  classified_by uuid references public.profiles(id)
);

create index idx_classifications_system on public.risk_classifications(system_id);
-- Only one active classification per system
create unique index idx_classifications_active on public.risk_classifications(system_id, classified_at);

-- ┌─────────────────────────────────┐
-- │  5. OBLIGATIONS (Identify)      │
-- └─────────────────────────────────┘

create table public.obligations (
  id uuid primary key default gen_random_uuid(),
  system_id uuid not null references public.ai_systems(id) on delete cascade,
  title text not null,
  description text,
  article_reference text not null,      -- "Art. 9(1)" format
  category text not null
    check (category in (
      'risk_management', 'data_governance', 'transparency',
      'human_oversight', 'technical_documentation', 'conformity_assessment',
      'registration', 'post_market_monitoring', 'fundamental_rights',
      'general_governance', 'gpai_obligations'
    )),
  risk_levels text[] not null,          -- applies to which risk levels
  deadline date,
  deadline_source text,                 -- "Art. 6(2) — 2 Aug 2026"
  status text not null default 'not_started'
    check (status in ('not_started', 'in_progress', 'completed', 'not_applicable')),
  evidence_notes text,                  -- kullanıcı notları
  -- Claude enrichment
  how_to_guide text,                    -- Claude multi-turn advisor output
  template_url text,                    -- Hexis şablon linki
  priority integer not null default 0,
  completed_at timestamptz,
  completed_by uuid references public.profiles(id),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index idx_obligations_system on public.obligations(system_id);
create index idx_obligations_status on public.obligations(status);

-- ┌─────────────────────────────────┐
-- │  6. ASSESSMENTS (Evaluate)      │
-- └─────────────────────────────────┘

create table public.assessments (
  id uuid primary key default gen_random_uuid(),
  system_id uuid not null references public.ai_systems(id) on delete cascade,
  -- Governance matrix inputs (0-4 scale: Absent → Embedded)
  oversight_level integer not null check (oversight_level between 0 and 4),
  monitoring_level integer not null check (monitoring_level between 0 and 4),
  documentation_level integer not null check (documentation_level between 0 and 4),
  -- Calculated fields (deterministic engine)
  weighted_maturity numeric(4,2) not null,
  activation_posture text not null,
  urgency_index numeric(4,2) not null,
  risk_exposure text not null
    check (risk_exposure in ('low', 'moderate', 'elevated', 'high')),
  -- Claude enrichment
  ai_insight jsonb,                     -- critical_gap, regulatory_perspective, etc.
  ai_model text,
  assessed_at timestamptz not null default now(),
  assessed_by uuid references public.profiles(id)
);

create index idx_assessments_system on public.assessments(system_id);

-- ┌─────────────────────────────────┐
-- │  7. ACTIONS (Navigate)          │
-- └─────────────────────────────────┘

create table public.actions (
  id uuid primary key default gen_random_uuid(),
  system_id uuid not null references public.ai_systems(id) on delete cascade,
  obligation_id uuid references public.obligations(id) on delete set null,
  title text not null,
  description text,
  priority text not null default 'medium'
    check (priority in ('critical', 'high', 'medium', 'low')),
  status text not null default 'todo'
    check (status in ('todo', 'in_progress', 'done')),
  estimated_hours integer,
  assigned_to uuid references public.profiles(id),
  due_date date,
  dimension_impact text[]               -- ['oversight', 'monitoring', 'documentation']
    default '{}',
  -- Claude enrichment
  ai_reasoning text,                    -- neden bu öncelik
  ai_generated boolean not null default false,
  depends_on uuid[] default '{}',
  completed_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index idx_actions_system on public.actions(system_id);
create index idx_actions_status on public.actions(status);

-- ┌─────────────────────────────────┐
-- │  8. COMPLIANCE SNAPSHOTS (Track)│
-- └─────────────────────────────────┘

create table public.compliance_snapshots (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  system_id uuid references public.ai_systems(id) on delete cascade,
  score numeric(5,2) not null,          -- 0-100
  obligations_total integer not null default 0,
  obligations_completed integer not null default 0,
  actions_total integer not null default 0,
  actions_completed integer not null default 0,
  metadata jsonb default '{}'::jsonb,
  snapshot_at timestamptz not null default now()
);

create index idx_snapshots_org on public.compliance_snapshots(org_id);
create index idx_snapshots_system on public.compliance_snapshots(system_id);
create index idx_snapshots_date on public.compliance_snapshots(snapshot_at);

-- ┌─────────────────────────────────┐
-- │  9. ADVISOR CONVERSATIONS       │
-- └─────────────────────────────────┘

create table public.advisor_conversations (
  id uuid primary key default gen_random_uuid(),
  system_id uuid not null references public.ai_systems(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  orient_step text not null
    check (orient_step in ('observe', 'risk', 'identify', 'evaluate', 'navigate', 'track')),
  title text,                           -- otomatik veya kullanıcı tarafından
  messages jsonb not null default '[]'::jsonb,
  message_count integer not null default 0,
  total_input_tokens integer not null default 0,
  total_output_tokens integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_conversations_system on public.advisor_conversations(system_id);
create index idx_conversations_user on public.advisor_conversations(user_id);

-- ┌─────────────────────────────────┐
-- │  10. API USAGE TRACKING         │
-- └─────────────────────────────────┘

create table public.api_usage (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  endpoint text not null,               -- 'ai/classify-insight', etc.
  model text not null,                  -- 'claude-haiku-4-5'
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  cached_tokens integer not null default 0,
  latency_ms integer,
  created_at timestamptz not null default now()
);

create index idx_usage_org on public.api_usage(org_id);
create index idx_usage_date on public.api_usage(created_at);

-- Partition-friendly: query by date range
-- For cost tracking: SUM(input_tokens), SUM(output_tokens) per org per month

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- ROW LEVEL SECURITY (RLS)
-- Every table: org-scoped access only
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Helper function: get current user's org_id
create or replace function public.get_user_org_id()
returns uuid as $$
  select org_id from public.profiles where id = auth.uid()
$$ language sql security definer stable;

-- ORGANIZATIONS
alter table public.organizations enable row level security;

create policy "Users can view own org"
  on public.organizations for select
  using (id = public.get_user_org_id());

create policy "Owners can update own org"
  on public.organizations for update
  using (id = public.get_user_org_id()
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('owner', 'admin')
    ));

-- PROFILES
alter table public.profiles enable row level security;

create policy "Users can view own org profiles"
  on public.profiles for select
  using (org_id = public.get_user_org_id());

create policy "Users can update own profile"
  on public.profiles for update
  using (id = auth.uid());

-- AI SYSTEMS
alter table public.ai_systems enable row level security;

create policy "Users can view own org systems"
  on public.ai_systems for select
  using (org_id = public.get_user_org_id());

create policy "Users can insert to own org"
  on public.ai_systems for insert
  with check (org_id = public.get_user_org_id());

create policy "Users can update own org systems"
  on public.ai_systems for update
  using (org_id = public.get_user_org_id());

create policy "Admins can delete own org systems"
  on public.ai_systems for delete
  using (org_id = public.get_user_org_id()
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('owner', 'admin')
    ));

-- RISK CLASSIFICATIONS
alter table public.risk_classifications enable row level security;

create policy "Users can view own org classifications"
  on public.risk_classifications for select
  using (exists (
    select 1 from public.ai_systems
    where ai_systems.id = risk_classifications.system_id
    and ai_systems.org_id = public.get_user_org_id()
  ));

create policy "Users can insert own org classifications"
  on public.risk_classifications for insert
  with check (exists (
    select 1 from public.ai_systems
    where ai_systems.id = risk_classifications.system_id
    and ai_systems.org_id = public.get_user_org_id()
  ));

-- OBLIGATIONS
alter table public.obligations enable row level security;

create policy "Users can view own org obligations"
  on public.obligations for select
  using (exists (
    select 1 from public.ai_systems
    where ai_systems.id = obligations.system_id
    and ai_systems.org_id = public.get_user_org_id()
  ));

create policy "Users can manage own org obligations"
  on public.obligations for all
  using (exists (
    select 1 from public.ai_systems
    where ai_systems.id = obligations.system_id
    and ai_systems.org_id = public.get_user_org_id()
  ));

-- ASSESSMENTS
alter table public.assessments enable row level security;

create policy "Users can view own org assessments"
  on public.assessments for select
  using (exists (
    select 1 from public.ai_systems
    where ai_systems.id = assessments.system_id
    and ai_systems.org_id = public.get_user_org_id()
  ));

create policy "Users can insert own org assessments"
  on public.assessments for insert
  with check (exists (
    select 1 from public.ai_systems
    where ai_systems.id = assessments.system_id
    and ai_systems.org_id = public.get_user_org_id()
  ));

-- ACTIONS
alter table public.actions enable row level security;

create policy "Users can manage own org actions"
  on public.actions for all
  using (exists (
    select 1 from public.ai_systems
    where ai_systems.id = actions.system_id
    and ai_systems.org_id = public.get_user_org_id()
  ));

-- COMPLIANCE SNAPSHOTS
alter table public.compliance_snapshots enable row level security;

create policy "Users can view own org snapshots"
  on public.compliance_snapshots for select
  using (org_id = public.get_user_org_id());

create policy "System can insert snapshots"
  on public.compliance_snapshots for insert
  with check (org_id = public.get_user_org_id());

-- ADVISOR CONVERSATIONS
alter table public.advisor_conversations enable row level security;

create policy "Users can manage own conversations"
  on public.advisor_conversations for all
  using (user_id = auth.uid());

-- API USAGE
alter table public.api_usage enable row level security;

create policy "Users can view own org usage"
  on public.api_usage for select
  using (org_id = public.get_user_org_id());

-- Insert allowed via service role only (API routes)

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- FUNCTIONS & TRIGGERS
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_organizations_updated
  before update on public.organizations
  for each row execute function public.handle_updated_at();

create trigger on_profiles_updated
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger on_ai_systems_updated
  before update on public.ai_systems
  for each row execute function public.handle_updated_at();

create trigger on_advisor_conversations_updated
  before update on public.advisor_conversations
  for each row execute function public.handle_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-generate org slug from name
create or replace function public.generate_org_slug()
returns trigger as $$
declare
  base_slug text;
  final_slug text;
  counter integer := 0;
begin
  base_slug := lower(regexp_replace(new.name, '[^a-zA-Z0-9]', '-', 'g'));
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  final_slug := base_slug;

  while exists (select 1 from public.organizations where slug = final_slug) loop
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  end loop;

  new.slug := final_slug;
  return new;
end;
$$ language plpgsql;

create trigger on_organization_slug
  before insert on public.organizations
  for each row
  when (new.slug is null or new.slug = '')
  execute function public.generate_org_slug();
