import { NextRequest, NextResponse } from 'next/server';

// Admin bypass cookie name — set this in your browser to access the site
const ADMIN_COOKIE = 'gfm_admin_access';
const ADMIN_TOKEN  = 'gfm_admin_2026_secure';

// Paths that bypass the lock (API routes, static assets)
const BYPASS_PATHS = [
  '/api/',
  '/_next/',
  '/favicon',
  '/robots',
  '/sitemap',
  '/manifest',
  '/maintenance',        // the maintenance page itself
  '/admin/access',       // admin login bypass
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow bypass paths
  if (BYPASS_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Check admin cookie
  const adminCookie = request.cookies.get(ADMIN_COOKIE);
  if (adminCookie?.value === ADMIN_TOKEN) {
    return NextResponse.next();
  }

  // Check admin token in query string (for initial access)
  const adminQuery = request.nextUrl.searchParams.get('admin_access');
  if (adminQuery === ADMIN_TOKEN) {
    const response = NextResponse.redirect(new URL(pathname, request.url));
    response.cookies.set(ADMIN_COOKIE, ADMIN_TOKEN, {
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'lax',
    });
    return response;
  }

  // Redirect public visitors to maintenance page
  const maintenance = new URL('/maintenance', request.url);
  return NextResponse.rewrite(maintenance);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
