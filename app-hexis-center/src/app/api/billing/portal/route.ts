/**
 * Billing — Customer Portal
 * ━━━━━━━━━━━━━━━━━━━━━━━━━
 * POST: Creates a Stripe Customer Portal session.
 * Allows the user to manage their subscription, update payment, cancel.
 */

import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/api/auth';
import { createPortalSession } from '@/lib/stripe';

export async function POST(request: Request) {
  const auth = await authenticateRequest();
  if (!auth.ok) return auth.error;

  const { ctx } = auth;

  try {
    // Get org's Stripe customer ID
    const { data: org } = await ctx.supabase
      .from('organizations')
      .select('stripe_customer_id')
      .eq('id', ctx.orgId)
      .single();

    if (!org?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 },
      );
    }

    const { origin } = new URL(request.url);

    const session = await createPortalSession({
      customerId: org.stripe_customer_id,
      returnUrl: `${origin}/dashboard/settings`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Portal session error:', err);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 },
    );
  }
}
