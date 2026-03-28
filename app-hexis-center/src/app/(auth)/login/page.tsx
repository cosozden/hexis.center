'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const supabase = createClient();

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    window.location.href = redirect;
  }

  async function handleGoogleLogin() {
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/callback?redirect=${redirect}`,
      },
    });

    if (error) {
      setError(error.message);
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl text-dark-type tracking-wide">
            HEXIS
          </h1>
          <p className="text-dark-sub text-sm mt-2">
            AI Governance Platform
          </p>
        </div>

        {/* Login form */}
        <div className="hexis-card p-6">
          <p className="label-upper mb-6">Sign In</p>

          <form onSubmit={handleEmailLogin}>
            <div className="mb-4">
              <label className="label-upper block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="hexis-input"
                placeholder="you@company.com"
                required
              />
            </div>

            <div className="mb-6">
              <label className="label-upper block mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="hexis-input"
                placeholder="Your password"
                required
              />
            </div>

            {error && (
              <p className="text-status-danger text-sm mb-4">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="hexis-btn hexis-btn-primary w-full mb-3"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <hr className="hexis-divider flex-1 my-0" />
            <span className="label-upper">or</span>
            <hr className="hexis-divider flex-1 my-0" />
          </div>

          {/* Google OAuth */}
          <button
            onClick={handleGoogleLogin}
            className="hexis-btn w-full"
          >
            Continue with Google
          </button>
        </div>

        {/* Sign up link */}
        <p className="text-center text-dark-sub text-sm mt-6">
          No account?{' '}
          <Link href="/signup" className="text-brass hover:underline">
            Create one
          </Link>
        </p>

        {/* Legal */}
        <p className="text-center text-dark-sub text-xs mt-4 max-w-xs mx-auto">
          By signing in you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
