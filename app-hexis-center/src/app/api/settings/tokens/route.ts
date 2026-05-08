/**
 * API Tokens — CRUD route
 * ━━━━━━━━━━━━━━━━━━━━━━━
 * GET  /api/settings/tokens         → list own-org tokens (plain text NOT returned)
 * POST /api/settings/tokens         → create a new token (plain text returned ONCE)
 *
 * Security model:
 *   - authenticateRequest() gates every operation via Supabase session cookie
 *   - plain-text tokens are only ever seen by the creator, once, in the POST response
 *   - Postgres stores only SHA-256 hash + short prefix for UI recognition
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateRequest } from '@/lib/api/auth';
import {
  generateApiToken,
  hashApiToken,
  extractTokenPrefix,
} from '@/lib/auth/token-hash';

export const dynamic = 'force-dynamic';

// ━━━ SCHEMAS ━━━

const CreateTokenSchema = z.object({
  name: z.string().min(1).max(80).trim().default('Untitled token'),
  scopes: z.array(z.enum(['read'])).min(1).default(['read']),
  expiresInDays: z.number().int().min(1).max(365).optional(),
});

// ━━━ GET: list tokens ━━━

export async function GET() {
  const auth = await authenticateRequest();
  if (!auth.ok) return auth.error;
  const { ctx } = auth;

  const { data, error } = await ctx.supabase
    .from('api_tokens')
    .select(
      'id, name, token_prefix, scopes, expires_at, revoked_at, last_used_at, created_at'
    )
    .eq('org_id', ctx.orgId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Tokens] list failed:', error);
    return NextResponse.json(
      { error: 'Failed to load tokens' },
      { status: 500 }
    );
  }

  return NextResponse.json({ tokens: data ?? [] });
}

// ━━━ POST: create token ━━━

export async function POST(request: Request) {
  const auth = await authenticateRequest();
  if (!auth.ok) return auth.error;
  const { ctx } = auth;

  let body: z.infer<typeof CreateTokenSchema>;
  try {
    const raw = await request.json().catch(() => ({}));
    body = CreateTokenSchema.parse(raw);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: err.errors.map((e) => e.message) },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Generate token, hash before insert, return plain-text ONCE in response
  const plainToken = generateApiToken();
  const tokenHash = hashApiToken(plainToken);
  const tokenPrefix = extractTokenPrefix(plainToken);

  const expiresAt = body.expiresInDays
    ? new Date(Date.now() + body.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
    : null;

  const { data, error } = await ctx.supabase
    .from('api_tokens')
    .insert({
      user_id: ctx.userId,
      org_id: ctx.orgId,
      token_hash: tokenHash,
      token_prefix: tokenPrefix,
      name: body.name,
      scopes: body.scopes,
      expires_at: expiresAt,
      created_by: ctx.userId,
    })
    .select('id, name, token_prefix, scopes, expires_at, created_at')
    .single();

  if (error) {
    console.error('[Tokens] create failed:', error);
    return NextResponse.json(
      { error: 'Failed to create token' },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      token: plainToken, // shown once — never retrievable again
      metadata: data,
    },
    { status: 201 }
  );
}
