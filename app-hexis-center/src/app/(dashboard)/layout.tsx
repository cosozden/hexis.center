import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/supabase/server';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Topbar } from '@/components/dashboard/topbar';

/**
 * Dashboard Layout — authenticated area
 * Sidebar (fixed) + Topbar + Main content
 * Dark theme — Hexis design system
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
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar — fixed width */}
      <Sidebar
        userName={profile.full_name || profile.email}
        orgName={(profile as Record<string, unknown>).organizations
          ? ((profile as Record<string, unknown>).organizations as Record<string, string>).name
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
