/**
 * Action CRUD — ORIENT Step 5: Navigate
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * PATCH /api/actions/[id] — Update action status, priority, etc.
 * DELETE /api/actions/[id] — Remove an action
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateRequest } from '@/lib/api/auth';

const UpdateActionSchema = z.object({
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  priority: z.enum(['critical', 'high', 'medium', 'low']).optional(),
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  estimated_hours: z.number().nullable().optional(),
  due_date: z.string().nullable().optional(),
  sort_order: z.number().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const auth = await authenticateRequest();
  if (!auth.ok) return auth.error;
  const { ctx } = auth;

  let updates: z.infer<typeof UpdateActionSchema>;
  try {
    const body = await request.json();
    updates = UpdateActionSchema.parse(body);
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Build update payload
  const payload: Record<string, unknown> = { ...updates };

  // Track completion
  if (updates.status === 'done') {
    payload.completed_at = new Date().toISOString();
  } else if (updates.status) {
    payload.completed_at = null;
  }

  const { data, error } = await ctx.supabase
    .from('actions')
    .update(payload)
    .eq('id', id)
    .select('id, title, status, priority, completed_at')
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to update action' }, { status: 500 });
  }

  return NextResponse.json({ action: data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const auth = await authenticateRequest();
  if (!auth.ok) return auth.error;
  const { ctx } = auth;

  const { error } = await ctx.supabase
    .from('actions')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: 'Failed to delete action' }, { status: 500 });
  }

  return NextResponse.json({ deleted: true });
}
