import Link from 'next/link';
import { createServerSupabaseClient, getUserProfile } from '@/lib/supabase/server';
import { Card } from '@/components/ui';
import { BillingSection } from '@/components/billing/billing-section';

export const dynamic = 'force-dynamic';

/**
 * Settings — account, organisation, and billing management
 */
export default async function SettingsPage() {
  let profile;
  try {
    profile = await getUserProfile();
  } catch {
    return null;
  }

  const org = profile?.organizations as Record<string, unknown> | null;
  const orgName = org ? String(org.name) : 'My Organisation';
  const subscriptionStatus = org?.subscription_status as string | null;
  const stripeCustomerId = org?.stripe_customer_id as string | null;

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="font-heading text-2xl text-foreground border-b border-primary pb-2 inline-block">
          Settings
        </h1>
        <p className="text-muted-foreground mt-3">
          Manage your account, billing, and organisation preferences.
        </p>
      </div>

      {/* Profile info */}
      <Card className="p-5 mb-4">
        <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-3">
          Account
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Name</p>
            <p className="text-foreground">{profile?.full_name || 'Not set'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-foreground">{profile?.email || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Role</p>
            <p className="text-foreground capitalize">{profile?.role || 'member'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Organisation</p>
            <p className="text-foreground">{orgName}</p>
          </div>
        </div>
      </Card>

      {/* Billing */}
      <BillingSection
        subscriptionStatus={subscriptionStatus}
        hasStripeCustomer={!!stripeCustomerId}
      />

      {/* API Tokens */}
      <Card className="p-5 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-3">
              API Tokens
            </p>
            <p className="text-foreground text-sm mb-1">
              Connect Claude Desktop and other clients
            </p>
            <p className="text-muted-foreground text-xs max-w-md">
              Create read-only tokens for the Hexis MCP Server. Hashed at rest;
              revocable at any time.
            </p>
          </div>
          <Link
            href="/dashboard/settings/tokens"
            className="text-xs text-foreground border border-primary px-3 py-2 hover:bg-primary hover:text-background transition-colors"
          >
            Manage tokens →
          </Link>
        </div>
      </Card>

      {/* Coming soon */}
      <Card accent className="text-center py-6 px-6 mt-4">
        <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-3">
          Coming Soon
        </p>
        <p className="text-muted-foreground max-w-md mx-auto text-sm">
          Profile editing, team management, and notification preferences
          will be available in a future update.
        </p>
      </Card>
    </div>
  );
}
