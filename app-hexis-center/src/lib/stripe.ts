/**
 * Stripe Integration
 * ━━━━━━━━━━━━━━━━━━
 * Handles: subscription creation, checkout sessions, webhook processing
 * Pricing: €9 first month → €29/month thereafter
 */

import Stripe from 'stripe';

// Lazy initialization — avoid crashing at build time when env vars are missing
function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) {
    if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
      console.warn('STRIPE_SECRET_KEY is not set — Stripe features disabled');
    }
    return null;
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-12-18.acacia' as Stripe.LatestApiVersion,
    typescript: true,
  });
}

export const stripe = getStripe();

/**
 * Create a Stripe Checkout session for new subscription
 * Includes promotional pricing: €9 first month, €29 thereafter
 */
export async function createCheckoutSession({
  orgId,
  customerEmail,
  successUrl,
  cancelUrl,
}: {
  orgId: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
}) {
  if (!stripe) throw new Error('Stripe is not configured');
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: customerEmail,
    line_items: [
      {
        price: process.env.STRIPE_PRO_PRICE_ID!,
        quantity: 1,
      },
    ],
    // First month discount via coupon
    discounts: process.env.STRIPE_INTRO_COUPON_ID
      ? [{ coupon: process.env.STRIPE_INTRO_COUPON_ID }]
      : undefined,
    subscription_data: {
      metadata: {
        org_id: orgId,
      },
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      org_id: orgId,
    },
  });

  return session;
}

/**
 * Create a Stripe Customer Portal session for managing subscription
 */
export async function createPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  if (!stripe) throw new Error('Stripe is not configured');
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}
