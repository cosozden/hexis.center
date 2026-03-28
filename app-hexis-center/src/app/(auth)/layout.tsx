/**
 * Auth Layout — prevents static prerendering of auth pages
 * Login and signup require Supabase client which needs runtime env vars
 */
export const dynamic = 'force-dynamic';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
