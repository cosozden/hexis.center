/**
 * PATCH/DELETE /api/evidence/items/:id
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Update or delete a single evidence item.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateRequest } from '@/lib/api/auth';

// ━━━ SCHEMAS ━━━

const UpdateItemSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  description: z.string().max(2000).nullable().optional(),
  isCompleted: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Provide at least one field to update' },
);

// ━━━ PATCH: Update evidence item ━━━

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authenticateRequest();
  if (!auth.ok) return auth.error;
  const { ctx } = auth;

  const { id } = await params;

  if (!z.string().uuid().safeParse(id).success) {
    return NextResponse.json({ error: 'Invalid evidence item ID' }, { status: 400 });
  }

  let body: z.infer<typeof UpdateItemSchema>;
  try {
    const raw = await request.json();
    body = UpdateItemSchema.parse(raw);
  } catch (err) {
    const message = err instanceof z.ZodError
      ? err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ')
      : 'Invalid request body';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // Build update payload (camelCase → snake_case)
  const update: Record<string, unknown> = {};
  if (body.title !== undefined) update.title = body.title;
  if (body.description !== undefined) update.description = body.description;
  if (body.sortOrder !== undefined) update.sort_order = body.sortOrder;
  if (body.isCompleted !== undefined) {
    update.is_completed = body.isCompleted;
    if (body.isCompleted) {
      update.completed_at = new Date().toISOString();
      update.completed_by = ctx.userId;
    } else {
      update.completed_at = null;
      update.completed_by = null;
    }
  }

  const { data: updated, error: dbError } = await ctx.supabase
    .from('evidence_items')
    .update(update)
    .eq('id', id)
    .select('*')
    .single();

  if (dbError) {
    console.error('[evidence/items/update] DB error:', dbError);
    return NextResponse.json({ error: 'Failed to update evidence item' }, { status: 500 });
  }

  if (!updated) {
    return NextResponse.json({ error: 'Evidence item not found or access denied' }, { status: 404 });
  }

  return NextResponse.json({ item: updated });
}

// ━━━ DELETE: Remove evidence item ━━━

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authenticateRequest();
  if (!auth.ok) return auth.error;
  const { ctx } = auth;

  const { id } = await params;

  if (!z.string().uuid().safeParse(id).success) {
    return NextResponse.json({ error: 'Invalid evidence item ID' }, { status: 400 });
  }

  const { error: dbError } = await ctx.supabase
    .from('evidence_items')
    .delete()
    .eq('id', id);

  if (dbError) {
    console.error('[evidence/items/delete] DB error:', dbError);
    return NextResponse.json({ error: 'Failed to delete evidence item' }, { status: 500 });
  }

  return NextResponse.json({ deleted: true });
}
