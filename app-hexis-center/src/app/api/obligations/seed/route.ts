/**
 * POST /api/obligations/seed
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━
 * ORIENT Step 3 (Identify) — Seed Obligations from Classification
 *
 * Flow:
 * 1. Auth check
 * 2. Verify system exists + has classification
 * 3. Check if obligations already seeded (idempotent)
 * 4. Run obligation engine → generate role-filtered obligation list
 * 5. Insert obligations into DB
 * 6. Return seeded obligations
 *
 * Idempotent: If obligations already exist for this system, returns existing ones.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateRequest } from '@/lib/api/auth';
import {
  getObligationsForRisk,
  type ObligationSeed,
} from '@/lib/engines/obligation-engine';

// ━━━ INPUT VALIDATION ━━━

const SeedRequestSchema = z.object({
  systemId: z.string().uuid(),
  // Force re-seed (deletes existing and recreates)
  force: z.boolean().optional().default(false),
});

// ━━━ DEADLINE MAP ━━━

const RISK_DEADLINE: Record<string, { date: string; source: string } | null> = {
  prohibited: { date: '2025-02-02', source: 'Art. 5 — Prohibited practices in force since 2 Feb 2025' },
  high: { date: '2026-08-02', source: 'Art. 6(2) — Annex III high-risk, 2 Aug 2026' },
  limited: { date: '2026-08-02', source: 'Art. 50 — Transparency obligations, 2 Aug 2026' },
  gpai: { date: '2025-08-02', source: 'Art. 51–53 — GPAI obligations in force since 2 Aug 2025' },
  minimal: null,
};

// ━━━ HANDLER ━━━

export async function POST(request: Request) {
  // 1. Authenticate
  const auth = await authenticateRequest();
  if (!auth.ok) return auth.error;
  const { ctx } = auth;

  // 2. Parse & validate input
  let body: z.infer<typeof SeedRequestSchema>;
  try {
    const raw = await request.json();
    body = SeedRequestSchema.parse(raw);
  } catch (err) {
    const message = err instanceof z.ZodError
      ? err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ')
      : 'Invalid request body';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // 3. Verify system exists + fetch classification + organisation role
  const { data: system } = await ctx.supabase
    .from('ai_systems')
    .select('id, name, organisation_role')
    .eq('id', body.systemId)
    .single();

  if (!system) {
    return NextResponse.json(
      { error: 'AI system not found or access denied' },
      { status: 404 },
    );
  }

  // 4. Fetch latest classification
  const { data: classification } = await ctx.supabase
    .from('risk_classifications')
    .select('id, risk_level, classification_path, article_references')
    .eq('system_id', body.systemId)
    .order('classified_at', { ascending: false })
    .limit(1)
    .single();

  if (!classification) {
    return NextResponse.json(
      { error: 'No risk classification found. Complete the Risk stage first.' },
      { status: 400 },
    );
  }

  // 5. Check if obligations already exist (idempotent unless force=true)
  const { count: existingCount } = await ctx.supabase
    .from('obligations')
    .select('id', { count: 'exact', head: true })
    .eq('system_id', body.systemId);

  if (existingCount && existingCount > 0 && !body.force) {
    // Return existing obligations
    const { data: existing } = await ctx.supabase
      .from('obligations')
      .select('*')
      .eq('system_id', body.systemId)
      .order('sort_order', { ascending: true });

    return NextResponse.json({
      seeded: false,
      message: 'Obligations already exist for this system',
      count: existingCount,
      obligations: existing ?? [],
    });
  }

  // 6. If force, delete existing obligations first
  if (body.force && existingCount && existingCount > 0) {
    await ctx.supabase
      .from('obligations')
      .delete()
      .eq('system_id', body.systemId);
  }

  // 7. Determine obligation engine options from classification path
  const classPath = classification.classification_path as Record<string, unknown>;
  const transparencyCategoryRaw = classPath?.transparencyCategory;
  const transparencyCategory =
    typeof transparencyCategoryRaw === 'string' ? transparencyCategoryRaw : null;
  const engineOptions = {
    includeTransparency: transparencyCategory !== null && transparencyCategory !== 'none',
    transparencyCategory,
    isGPAI: classPath?.gpaiRole === 'gpai_provider',
    isGPAISystemic: classPath?.gpaiRole === 'gpai_systemic',
  };

  // 8. Run obligation engine
  const organisationRole = (system.organisation_role ?? 'deployer') as 'provider' | 'deployer' | 'both';

  // Map DB risk level to engine risk level for accurate obligation generation
  const engineRiskLevel = mapDbToEngineRiskLevel(
    classification.risk_level,
    classPath,
  );

  const seeds: ObligationSeed[] = getObligationsForRisk(
    engineRiskLevel,
    organisationRole,
    engineOptions,
  );

  // 9. Map seeds to DB records
  const deadlineInfo = RISK_DEADLINE[classification.risk_level] ?? null;

  const records = seeds.map((seed, index) => ({
    system_id: body.systemId,
    obligation_key: seed.obligationKey,
    title: seed.title,
    description: seed.description,
    article_reference: seed.article || '—',
    category: seed.category,
    applies_to: seed.appliesTo,
    risk_levels: [classification.risk_level],
    deadline: deadlineInfo?.date ?? null,
    deadline_source: deadlineInfo?.source ?? null,
    status: 'not_started' as const,
    priority: index,
    sort_order: index,
  }));

  // 10. Insert into DB
  const { data: inserted, error: dbError } = await ctx.supabase
    .from('obligations')
    .insert(records)
    .select('*');

  if (dbError) {
    console.error('[obligations/seed] DB error:', dbError);
    return NextResponse.json(
      { error: 'Failed to create obligations', details: dbError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    seeded: true,
    message: `Created ${inserted?.length ?? 0} obligations based on ${classification.risk_level} risk level and ${organisationRole} role`,
    count: inserted?.length ?? 0,
    obligations: inserted ?? [],
  });
}

// ━━━ HELPERS ━━━

/**
 * Maps DB risk_level back to engine RiskLevel for accurate obligation generation.
 * DB stores simplified levels; engine has more granular ones.
 */
function mapDbToEngineRiskLevel(
  dbLevel: string,
  classPath: Record<string, unknown>,
): string {
  // Check for Art. 6(3) exception from classification path
  if (dbLevel === 'minimal' && classPath?.art6Exception && classPath.art6Exception !== 'none') {
    return 'not_high_risk';
  }
  // Check for GPAI systemic from classification path
  if (dbLevel === 'gpai' && classPath?.gpaiRole === 'gpai_systemic') {
    return 'gpai_systemic';
  }
  return dbLevel;
}
