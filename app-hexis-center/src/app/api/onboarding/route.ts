/**
 * Onboarding API Route — server-side org creation
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Validates input, creates org, links profile, optionally creates first system.
 * All operations run server-side with proper auth + validation.
 *
 * POST /api/onboarding
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateRequest } from '@/lib/api/auth';

// ━━━ INPUT SCHEMA ━━━

const OnboardingSchema = z.object({
  orgName: z.string().min(2).max(100).trim(),
  industry: z.string().max(50).optional().default(''),
  role: z.string().max(30).optional().default(''),
  firstSystemName: z.string().max(200).trim().optional().default(''),
  firstSystemPurpose: z.string().max(2000).trim().optional().default(''),
});

// ━━━ ROUTE ━━━

export async function POST(request: Request) {
  // 1. Auth
  const auth = await authenticateRequest();
  if (!auth.ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { ctx } = auth;

  // 2. Check user doesn't already have an org
  if (ctx.orgId) {
    return NextResponse.json(
      { error: 'Already onboarded — organisation exists' },
      { status: 409 }
    );
  }

  // 3. Parse & validate input
  let body: z.infer<typeof OnboardingSchema>;
  try {
    const raw = await request.json();
    body = OnboardingSchema.parse(raw);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: err.errors.map((e) => e.message) },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  try {
    // 4. Create organisation
    const slug = body.orgName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40);

    const { data: org, error: orgError } = await ctx.supabase
      .from('organizations')
      .insert({
        name: body.orgName,
        slug: `${slug}-${Date.now().toString(36)}`,
        settings: {
          industry: body.industry,
          onboarded_at: new Date().toISOString(),
        },
      })
      .select('id')
      .single();

    if (orgError) {
      console.error('[Onboarding] Org creation failed:', orgError);
      return NextResponse.json(
        { error: 'Failed to create organisation' },
        { status: 500 }
      );
    }

    // 5. Link profile to org (owner role, always)
    const { error: profileError } = await ctx.supabase
      .from('profiles')
      .update({
        org_id: org.id,
        role: 'owner' as const,
        onboarding_completed: true,
      })
      .eq('id', ctx.userId);

    if (profileError) {
      console.error('[Onboarding] Profile update failed:', profileError);
      // Attempt cleanup
      await ctx.supabase.from('organizations').delete().eq('id', org.id);
      return NextResponse.json(
        { error: 'Failed to link profile to organisation' },
        { status: 500 }
      );
    }

    // 6. Create first system (optional)
    let systemId: string | null = null;
    if (body.firstSystemName) {
      const { data: system } = await ctx.supabase
        .from('ai_systems')
        .insert({
          org_id: org.id,
          name: body.firstSystemName,
          purpose: body.firstSystemPurpose || null,
          created_by: ctx.userId,
          observe_metadata: {
            onboarding_source: true,
            user_role: body.role,
          },
        })
        .select('id')
        .single();

      systemId = system?.id ?? null;
    }

    return NextResponse.json({
      orgId: org.id,
      systemId,
      message: 'Onboarding complete',
    });
  } catch (err) {
    console.error('[Onboarding] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
