/**
 * PATCH /api/obligations/:id
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Update a single obligation's status or notes.
 * Used by the Identify page when user tracks progress.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateRequest } from '@/lib/api/auth';

// ━━━ INPUT VALIDATION ━━━

const UpdateObligationSchema = z.object({
  status: z.enum(['not_started', 'in_progress', 'completed', 'not_applicable']).optional(),
  evidence_notes: z.string().max(5000).optional(),
}).refine(
  (data) => data.status !== undefined || data.evidence_notes !== undefined,
  { message: 'Provide at least one field to update (status or evidence_notes)' },
);

// ━━━ HANDLER ━━━

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  // 1. Authenticate
  const auth = await authenticateRequest();
  if (!auth.ok) return auth.error;
  const { ctx } = auth;

  const { id } = await params;

  // 2. Validate UUID format
  if (!z.string().uuid().safeParse(id).success) {
    return NextResponse.json({ error: 'Invalid obligation ID' }, { status: 400 });
  }

  // 3. Parse & validate input
  let body: z.infer<typeof UpdateObligationSchema>;
  try {
    const raw = await request.json();
    body = UpdateObligationSchema.parse(raw);
  } catch (err) {
    const message = err instanceof z.ZodError
      ? err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ')
      : 'Invalid request body';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // 4. Build update payload
  const update: Record<string, unknown> = {};
  if (body.status !== undefined) {
    update.status = body.status;
    if (body.status === 'completed') {
      update.completed_at = new Date().toISOString();
      update.completed_by = ctx.userId;
    } else {
      update.completed_at = null;
      update.completed_by = null;
    }
  }
  if (body.evidence_notes !== undefined) {
    update.evidence_notes = body.evidence_notes;
  }

  // 5. Update (RLS ensures org-scoped access)
  const { data: updated, error: dbError } = await ctx.supabase
    .from('obligations')
    .update(update)
    .eq('id', id)
    .select('*')
    .single();

  if (dbError) {
    console.error('[obligations/update] DB error:', dbError);
    return NextResponse.json(
      { error: 'Failed to update obligation' },
      { status: 500 },
    );
  }

  if (!updated) {
    return NextResponse.json(
      { error: 'Obligation not found or access denied' },
      { status: 404 },
    );
  }

  return NextResponse.json({ obligation: updated });
}
