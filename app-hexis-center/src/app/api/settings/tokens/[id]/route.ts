/**
 * API Tokens — revoke a single token
 * DELETE /api/settings/tokens/:id
 *
 * Soft-revoke (sets revoked_at = now) so audit trail is preserved.
 * RLS ensures only in-org users can hit this row; the policy additionally
 * limits updates to the token owner or owner/admin roles.
 */

import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/api/auth';

export const dynamic = 'force-dynamic';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authenticateRequest();
  if (!auth.ok) return auth.error;
  const { ctx } = auth;

  const { id } = await params;
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Invalid token id' }, { status: 400 });
  }

  const { error } = await ctx.supabase
    .from('api_tokens')
    .update({ revoked_at: new Date().toISOString() })
    .eq('id', id)
    .eq('org_id', ctx.orgId);

  if (error) {
    console.error('[Tokens] revoke failed:', error);
    return NextResponse.json(
      { error: 'Failed to revoke token' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
