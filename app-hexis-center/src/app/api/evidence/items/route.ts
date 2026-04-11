/**
 * GET/POST /api/evidence/items
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * List evidence items for an obligation, or create a new one.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateRequest } from '@/lib/api/auth';

// ━━━ SCHEMAS ━━━

const ListQuerySchema = z.object({
  obligationId: z.string().uuid(),
});

const CreateItemSchema = z.object({
  obligationId: z.string().uuid(),
  title: z.string().min(1).max(500),
  description: z.string().max(2000).optional(),
  source: z.enum(['user', 'ai_suggested', 'template']).default('user'),
  aiModel: z.string().optional(),
  sortOrder: z.number().int().min(0).default(0),
});

// ━━━ GET: List items for an obligation ━━━

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

  const { data: items, error: dbError } = await ctx.supabase
    .from('evidence_items')
    .select('*')
    .eq('obligation_id', parsed.data.obligationId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (dbError) {
    console.error('[evidence/items] List error:', dbError);
    return NextResponse.json({ error: 'Failed to fetch evidence items' }, { status: 500 });
  }

  return NextResponse.json({ items: items ?? [] });
}

// ━━━ POST: Create a new evidence item ━━━

export async function POST(request: Request) {
  const auth = await authenticateRequest();
  if (!auth.ok) return auth.error;
  const { ctx } = auth;

  let body: z.infer<typeof CreateItemSchema>;
  try {
    const raw = await request.json();
    body = CreateItemSchema.parse(raw);
  } catch (err) {
    const message = err instanceof z.ZodError
      ? err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ')
      : 'Invalid request body';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { data: item, error: dbError } = await ctx.supabase
    .from('evidence_items')
    .insert({
      obligation_id: body.obligationId,
      title: body.title,
      description: body.description ?? null,
      source: body.source,
      ai_model: body.aiModel ?? null,
      sort_order: body.sortOrder,
    })
    .select('*')
    .single();

  if (dbError) {
    console.error('[evidence/items] Insert error:', dbError);
    return NextResponse.json({ error: 'Failed to create evidence item' }, { status: 500 });
  }

  return NextResponse.json({ item }, { status: 201 });
}
