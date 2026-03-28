'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 1. Create auth user
    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          org_name: orgName,
        },
        emailRedirectTo: `${window.location.origin}/callback`,
      },
    });

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      setSuccess(true);
    }

    setLoading(false);
  }

  async function handleGoogleSignup() {
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/callback`,
      },
    });

    if (error) {
      setError(error.message);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
        <div className="hexis-card max-w-sm w-full p-6 text-center">
          <p className="label-upper mb-4 text-brass">Verification Sent</p>
          <p className="text-dark-type">
            Check your email to verify your account.
          </p>
          <p className="text-dark-sub text-sm mt-2">
            Then return here to sign in.
          </p>
        </div>
      </div>
    );
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
            Start your AI governance journey
          </p>
        </div>

        <div className="hexis-card p-6">
          <p className="label-upper mb-6">Create Account</p>

          <form onSubmit={handleSignup}>
            <div className="mb-4">
              <label className="label-upper block mb-1.5">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="hexis-input"
                placeholder="Your full name"
                required
              />
            </div>

            <div className="mb-4">
              <label className="label-upper block mb-1.5">Organisation</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="hexis-input"
                placeholder="Company name"
                required
              />
            </div>

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
                placeholder="Min. 8 characters"
                minLength={8}
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
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <hr className="hexis-divider flex-1 my-0" />
            <span className="label-upper">or</span>
            <hr className="hexis-divider flex-1 my-0" />
          </div>

          <button onClick={handleGoogleSignup} className="hexis-btn w-full">
            Continue with Google
          </button>
        </div>

        <p className="text-center text-dark-sub text-sm mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-brass hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
