
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Updated credentials as requested
    const ADMIN_USERNAME = 'gaurav kumar';
    const ADMIN_EMAIL = 'gauravaj@gmail.com';
    const ADMIN_PASSWORD = 'gaurav@221';

    if (
      (identifier === ADMIN_USERNAME || identifier === ADMIN_EMAIL) &&
      password === ADMIN_PASSWORD
    ) {
      // Set auth cookie (using document.cookie as simple solution)
      document.cookie = 'admin_auth=true; path=/; max-age=3600';
      router.push('/dashboard');
    } else {
      setError('Invalid username/email or password');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full adminix-card p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Adminix</h1>
          <p className="text-gray-500">Sign in to your admin dashboard</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-100 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="adminix-label" htmlFor="identifier">
              Username or Email
            </label>
            <input
              id="identifier"
              type="text"
              className="adminix-input"
              placeholder="gaurav kumar / gauravaj@gmail.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="adminix-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="adminix-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full adminix-btn-primary py-3"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-400">
          <p>Demo credentials: gaurav kumar / gaurav@221</p>
        </div>
      </div>
    </div>
  );
}
