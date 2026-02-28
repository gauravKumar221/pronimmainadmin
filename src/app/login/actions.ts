'use server';

import { cookies } from 'next/headers';

const getApiUrl = () =>
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const COOKIE_NAME = 'super_admin_token';

/**
 * Server action: Super Admin login via backend API
 * Calls pronim-backend /api/super-admin/login and sets JWT cookie on success
 */
export async function loginAction(identifier: string, password: string) {
  const cleanIdentifier = identifier?.trim() || '';
  const cleanPassword = password?.trim() || '';

  if (!cleanIdentifier || !cleanPassword) {
    return { success: false, error: 'Username/email and password are required' };
  }

  try {
    const res = await fetch(`${getApiUrl()}/super-admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: cleanIdentifier, password: cleanPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data.message || 'Invalid username/email or password',
      };
    }

    if (data.success && data.data?.token) {
      const cookieStore = await cookies();
      cookieStore.set(COOKIE_NAME, data.data.token, {
        path: '/',
        maxAge: 3600, // 1 hour
        httpOnly: false, // Client may need to read for API calls
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      return { success: true };
    }

    return { success: false, error: 'Invalid response from server' };
  } catch (err) {
    console.error('Super Admin login error:', err);
    return {
      success: false,
      error: 'Unable to reach server. Please try again.',
    };
  }
}
