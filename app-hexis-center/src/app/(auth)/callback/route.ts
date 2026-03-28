/**
 * Auth Callback — handles OAuth redirects and email confirmations
 * Supabase redirects here after Google OAuth or email verification
 */
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const redirect = searchParams.get('redirect') || '/dashboard';

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if user needs onboarding (no org yet)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('org_id')
          .eq('id', user.id)
          .single();

        if (!profile?.org_id) {
          // New user — create org from signup metadata
          const orgName = user.user_metadata?.org_name || `${user.email}'s Organization`;
          const { data: org } = await supabase
            .from('organizations')
            .insert({ name: orgName })
            .select()
            .single();

          if (org) {
            await supabase
              .from('profiles')
              .update({ org_id: org.id, role: 'owner' })
              .eq('id', user.id);
          }
        }
      }

      return NextResponse.redirect(`${origin}${redirect}`);
    }
  }

  // Auth error — redirect to login
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
