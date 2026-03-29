/**
 * API Route Authentication & Rate Limiting
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Server-side only — used in all API route handlers.
 *
 * Provides:
 * - authenticateRequest() → validates session, returns user context
 * - checkRateLimit() → per-user daily limit for AI endpoints
 * - logUsage() → tracks AI API token consumption
 */

import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { DAILY_REQUEST_LIMIT } from '@/lib/claude/client';

// ━━━ TYPES ━━━

export interface AuthContext {
  userId: string;
  orgId: string;
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>;
}

interface AuthSuccess {
  ok: true;
  ctx: AuthContext;
}

interface AuthFailure {
  ok: false;
  error: NextResponse;
}

type AuthResult = AuthSuccess | AuthFailure;

// ━━━ AUTHENTICATION ━━━

/**
 * Authenticate the current request via Supabase session cookie.
 * Returns user context (userId, orgId, supabase client) or a 401 response.
 */
export async function authenticateRequest(): Promise<AuthResult> {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      ok: false,
      error: NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      ),
    };
  }

  // Get user's org_id from profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', user.id)
    .single();

  if (!profile?.org_id) {
    return {
      ok: false,
      error: NextResponse.json(
        { error: 'Organisation not found — complete onboarding first' },
        { status: 403 },
      ),
    };
  }

  return {
    ok: true,
    ctx: {
      userId: user.id,
      orgId: profile.org_id,
      supabase,
    },
  };
}

// ━━━ RATE LIMITING ━━━

/**
 * Check if user has exceeded daily AI request limit.
 * Uses ai_usage_logs table to count requests in the last 24h.
 */
export async function checkRateLimit(
  ctx: AuthContext,
  endpoint: string,
): Promise<{ allowed: true } | { allowed: false; error: NextResponse }> {
  const { supabase, userId } = ctx;

  const twentyFourHoursAgo = new Date(
    Date.now() - 24 * 60 * 60 * 1000,
  ).toISOString();

  const { count } = await supabase
    .from('ai_usage_logs')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', twentyFourHoursAgo);

  if ((count ?? 0) >= DAILY_REQUEST_LIMIT) {
    return {
      allowed: false,
      error: NextResponse.json(
        {
          error: `Daily AI request limit (${DAILY_REQUEST_LIMIT}) reached. Resets in 24 hours.`,
          limit: DAILY_REQUEST_LIMIT,
          used: count,
        },
        { status: 429 },
      ),
    };
  }

  return { allowed: true };
}

// ━━━ USAGE LOGGING ━━━

/**
 * Log AI API usage for cost tracking and rate limiting.
 * Non-fatal — caller should catch and warn, never crash.
 */
export async function logUsage(
  ctx: AuthContext,
  endpoint: string,
  model: string,
  usage: { inputTokens: number; outputTokens: number },
  latencyMs: number,
): Promise<void> {
  const { supabase, userId, orgId } = ctx;

  await supabase.from('ai_usage_logs').insert({
    user_id: userId,
    org_id: orgId,
    endpoint,
    model,
    input_tokens: usage.inputTokens,
    output_tokens: usage.outputTokens,
    latency_ms: latencyMs,
  });
}
