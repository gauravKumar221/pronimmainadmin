
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Temporarily disabled authentication check to allow direct access to dashboard
  /*
  const isAuth = request.cookies.get('admin_auth')?.value === 'true';
  const protectedRoutes = ['/dashboard'];

  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuth) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (pathname === '/login' && isAuth) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  */

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
