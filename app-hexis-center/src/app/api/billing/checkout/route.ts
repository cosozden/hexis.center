/**
 * Billing — Create Checkout Session
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * POST: Creates a Stripe Checkout session for the user's org.
 * Redirects to Stripe-hosted checkout page.
 */

import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/api/auth';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(request: Request) {
  const auth = await authenticateRequest();
  if (!auth.ok) return auth.error;

  const { ctx } = auth;

  try {
    // Get user email for pre-filling checkout
    const { data: profile } = await ctx.supabase
      .from('profiles')
      .select('email')
      .eq('id', ctx.userId)
      .single();

    if (!profile?.email) {
      return NextResponse.json(
        { error: 'Profile email not found' },
        { status: 400 },
      );
    }

    const { origin } = new URL(request.url);

    const session = await createCheckoutSession({
      orgId: ctx.orgId,
      customerEmail: profile.email,
      successUrl: `${origin}/dashboard?checkout=success`,
      cancelUrl: `${origin}/dashboard/settings?checkout=canceled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Checkout session error:', err);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 },
    );
  }
}
