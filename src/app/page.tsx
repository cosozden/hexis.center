import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/server';

/**
 * Root page — redirects based on auth state
 * Authenticated → Dashboard
 * Not authenticated → Login
 */
export default async function HomePage() {
  const user = await getUser();

  if (user) {
    redirect('/dashboard');
  }

  redirect('/login');
}
