import { NextResponse, type NextRequest } from 'next/server';

const protectedPrefixes = ['/dashboard', '/portals', '/profile', '/favorites', '/support'];
const adminPrefixes = ['/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get('satguru_role')?.value;
  const hasSession = Boolean(request.cookies.get('satguru_session')?.value) || process.env.NODE_ENV !== 'production';

  if (adminPrefixes.some((prefix) => pathname.startsWith(prefix)) && !['admin', 'super_admin'].includes(role ?? '') && process.env.NODE_ENV === 'production') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (protectedPrefixes.some((prefix) => pathname.startsWith(prefix)) && !hasSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ['/dashboard/:path*', '/portals/:path*', '/profile/:path*', '/favorites/:path*', '/support/:path*', '/admin/:path*'] };
