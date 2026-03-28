import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/supabase/server';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Topbar } from '@/components/dashboard/topbar';

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

  return (
    <div className="theme-light flex h-screen overflow-hidden bg-dark-bg">
      {/* Sidebar — fixed width */}
      <Sidebar
        userName={String(profile.full_name || profile.email || 'User')}
        orgName={
          profile.organizations
            ? String((profile.organizations as Record<string, string>).name)
            : 'My Organization'}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
