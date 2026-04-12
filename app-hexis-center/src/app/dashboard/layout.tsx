import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/supabase/server';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Topbar } from '@/components/dashboard/topbar';
import { SubscriptionGuard } from '@/components/billing/subscription-guard';

export const dynamic = 'force-dynamic';

/**
 * Dashboard Layout — authenticated area
 * Sidebar (fixed) + Topbar + Main content
 * Light theme — Hexis design system (login/signup stay dark)
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let profile;
  try {
    profile = await getUserProfile();
  } catch {
    redirect('/login');
  }

  if (!profile) {
    redirect('/login');
  }

  // If no org yet, redirect to onboarding
  if (!profile.org_id) {
    redirect('/onboarding');
  }

  const org = profile.organizations as Record<string, unknown> | null;
  const subscriptionStatus = (org?.subscription_status as string) ?? null;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar — stays in dark theme (no theme-light) */}
      <Sidebar
        userName={String(profile.full_name || profile.email || 'User')}
        orgName={org ? String(org.name) : 'My Organization'}
      />

      {/* Main area — light theme */}
      <div className="theme-light flex-1 flex flex-col overflow-hidden bg-background">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <SubscriptionGuard subscriptionStatus={subscriptionStatus}>
            {children}
          </SubscriptionGuard>
        </main>
      </div>
    </div>
  );
}
