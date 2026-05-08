-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- HEXIS AI GOVERNANCE PLATFORM — API TOKENS
-- Migration: 005_api_tokens
-- Date: 2026-04-19
-- Purpose: Dedicated API token store for MCP Server + external integrations.
--          Hashed at rest (SHA-256), scopes, expiry, revocation, audit trail.
--          GDPR Art. 32 — "appropriate technical measures" for credentials.
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- ┌─────────────────────────────────┐
-- │  1. API TOKENS TABLE            │
-- └─────────────────────────────────┘
-- Plain-text tokens are NEVER stored. Only SHA-256 hash + a short prefix
-- (first 8 chars after the "hexis_" marker) for user recognition in the UI.
--
-- Token format shown to user once: "hexis_<24-random-url-safe-chars>"
-- Token prefix shown in dashboard: "hexis_XXXXXXXX…"

create table public.api_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  org_id uuid not null references public.organizations(id) on delete cascade,

  -- SHA-256 hex digest of the plain-text token (unique across all orgs)
  token_hash text not null unique,

  -- First 8 characters of the random portion — for UI display only
  token_prefix text not null,

  -- User-assigned label ("Claude Desktop — MacBook")
  name text not null default 'Untitled token',

  -- Scopes control which MCP tools the token can call
  -- v1 defaults to read-only; later we can add 'write' for mutating tools
  scopes text[] not null default '{read}'::text[],

  -- Lifecycle
  expires_at timestamptz,
  revoked_at timestamptz,
  last_used_at timestamptz,

  created_at timestamptz not null default now(),
  created_by uuid references public.profiles(id) on delete set null,

  constraint api_tokens_scopes_nonempty check (array_length(scopes, 1) >= 1)
);

-- Lookup performance: MCP auth path is token_hash
create index idx_api_tokens_token_hash on public.api_tokens(token_hash);
create index idx_api_tokens_org on public.api_tokens(org_id);
create index idx_api_tokens_user on public.api_tokens(user_id);

-- ┌─────────────────────────────────┐
-- │  2. ROW LEVEL SECURITY          │
-- └─────────────────────────────────┘
alter table public.api_tokens enable row level security;

-- Users see tokens scoped to their org only
create policy "Users can view own org api_tokens"
  on public.api_tokens for select
  using (org_id = public.get_user_org_id());

-- Users can create tokens for themselves inside their own org
create policy "Users can insert own api_tokens"
  on public.api_tokens for insert
  with check (
    org_id = public.get_user_org_id()
    and user_id = auth.uid()
  );

-- Users can revoke their own tokens; owners/admins can revoke any in-org token
create policy "Users can update own api_tokens"
  on public.api_tokens for update
  using (
    org_id = public.get_user_org_id()
    and (
      user_id = auth.uid()
      or exists (
        select 1 from public.profiles
        where id = auth.uid() and role in ('owner', 'admin')
      )
    )
  );

-- Hard delete is restricted to owner/admin (revocation is preferred)
create policy "Admins can delete api_tokens"
  on public.api_tokens for delete
  using (
    org_id = public.get_user_org_id()
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('owner', 'admin')
    )
  );

-- ┌─────────────────────────────────┐
-- │  3. HELPER — AUDIT LOG COLUMN   │
-- └─────────────────────────────────┘
-- api_usage.endpoint already tracks "who called what"; the MCP server
-- will write rows of the form endpoint = 'mcp:<tool_name>' so existing
-- rate-limit + usage logic applies without new tables.
--
-- No schema change required here — documentation-only comment.

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- END OF MIGRATION 005
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
