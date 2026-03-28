/**
 * Next.js Middleware — runs on every request
 * Handles: auth session refresh, protected route guards
 */
import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public assets
     * - API webhook routes (Stripe needs raw body)
     */
    '/((?!_next/static|_next/image|favicon.ico|assets/|api/webhooks/).*)',
  ],
};
