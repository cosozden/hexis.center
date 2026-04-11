/**
 * GET/POST /api/evidence/attachments
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * List attachments for an obligation, or add a new link/file attachment.
 * File uploads go to Supabase Storage (evidence bucket).
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateRequest } from '@/lib/api/auth';

// ━━━ SCHEMAS ━━━

const ListQuerySchema = z.object({
  obligationId: z.string().uuid(),
});

const AddLinkSchema = z.object({
  obligationId: z.string().uuid(),
  evidenceItemId: z.string().uuid().optional(),
  fileName: z.string().min(1).max(255),
  externalUrl: z.string().url().max(2000),
  description: z.string().max(1000).optional(),
});

// ━━━ GET: List attachments ━━━

export async function GET(request: Request) {
  const auth = await authenticateRequest();
  if (!auth.ok) return auth.error;
  const { ctx } = auth;

  const url = new URL(request.url);
  const obligationId = url.searchParams.get('obligationId');

  const parsed = ListQuerySchema.safeParse({ obligationId });
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'obligationId query parameter required (valid UUID)' },
      { status: 400 },
    );
  }

  const { data: attachments, error: dbError } = await ctx.supabase
    .from('evidence_attachments')
    .select('*')
    .eq('obligation_id', parsed.data.obligationId)
    .order('created_at', { ascending: true });

  if (dbError) {
    console.error('[evidence/attachments] List error:', dbError);
    return NextResponse.json({ error: 'Failed to fetch attachments' }, { status: 500 });
  }

  return NextResponse.json({ attachments: attachments ?? [] });
}

// ━━━ POST: Add link attachment ━━━
// File uploads handled via separate /api/evidence/upload route

export async function POST(request: Request) {
  const auth = await authenticateRequest();
  if (!auth.ok) return auth.error;
  const { ctx } = auth;

  let body: z.infer<typeof AddLinkSchema>;
  try {
    const raw = await request.json();
    body = AddLinkSchema.parse(raw);
  } catch (err) {
    const message = err instanceof z.ZodError
      ? err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ')
      : 'Invalid request body';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { data: attachment, error: dbError } = await ctx.supabase
    .from('evidence_attachments')
    .insert({
      obligation_id: body.obligationId,
      evidence_item_id: body.evidenceItemId ?? null,
      attachment_type: 'link',
      file_name: body.fileName,
      external_url: body.externalUrl,
      description: body.description ?? null,
      uploaded_by: ctx.userId,
    })
    .select('*')
    .single();

  if (dbError) {
    console.error('[evidence/attachments] Insert error:', dbError);
    return NextResponse.json({ error: 'Failed to add attachment' }, { status: 500 });
  }

  return NextResponse.json({ attachment }, { status: 201 });
}
