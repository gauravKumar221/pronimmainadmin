'use server';

import { cookies } from 'next/headers';

/**
 * Server action to handle admin login verification.
 * Compares input against environment variables and sets an auth cookie on success.
 */
export async function loginAction(identifier: string, password: string) {
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  // Basic validation against environment variables
  if (
    (identifier === ADMIN_USERNAME || identifier === ADMIN_EMAIL) &&
    password === ADMIN_PASSWORD
  ) {
    const cookieStore = await cookies();
    // Set a cookie that matches the middleware's expectation
    cookieStore.set('admin_auth', 'true', {
      path: '/',
      maxAge: 3600, // 1 hour
      // httpOnly: false allows the existing client-side logout logic to work (document.cookie)
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return { success: true };
  }

  return { success: false, error: 'Invalid username/email or password' };
}
