import { createServerSupabaseClient, getUserProfile } from '@/lib/supabase/server';
import { Card } from '@/components/ui';

export const dynamic = 'force-dynamic';

/**
 * Settings — account and organisation settings
 * Shows basic profile and org info. Full implementation in a later sprint.
 */
export default async function SettingsPage() {
  let profile;
  try {
    profile = await getUserProfile();
  } catch {
    return null;
  }

  const orgName = profile?.organizations
    ? String((profile.organizations as Record<string, string>).name)
    : 'My Organisation';

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="font-heading text-2xl text-foreground border-b border-primary pb-2 inline-block">
          Settings
        </h1>
        <p className="text-muted-foreground mt-3">
          Manage your account and organisation preferences.
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

      <Card accent className="text-center py-8 px-6">
        <p className="text-[9px] uppercase tracking-[0.1em] text-primary mb-3">
          Coming Soon
        </p>
        <p className="text-muted-foreground max-w-md mx-auto">
          Profile editing, team management, billing, and notification preferences
          will be available in a future update.
        </p>
      </Card>
    </div>
  );
}
