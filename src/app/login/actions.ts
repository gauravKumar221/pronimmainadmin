
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

  // Debug check (only visible in server logs)
  if (!ADMIN_PASSWORD) {
    console.error('Login Error: ADMIN_PASSWORD is not set in environment variables.');
    return { success: false, error: 'System configuration error. Please contact support.' };
  }

  // Basic validation against environment variables
  // Trimming inputs to avoid issues with accidental trailing spaces
  const cleanIdentifier = identifier.trim();
  const cleanPassword = password.trim();

  if (
    (cleanIdentifier === ADMIN_USERNAME || cleanIdentifier === ADMIN_EMAIL) &&
    cleanPassword === ADMIN_PASSWORD
  ) {
    const cookieStore = await cookies();
    // Set a cookie that matches the middleware's expectation
    cookieStore.set('admin_auth', 'true', {
      path: '/',
      maxAge: 3600, // 1 hour
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return { success: true };
  }

  return { success: false, error: 'Invalid username/email or password' };
}
