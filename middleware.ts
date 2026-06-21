import { NextResponse, type NextRequest } from 'next/server';

const publicPaths = ['/', '/login', '/signup', '/verify-otp', '/forgot-password', '/contact'];
const publicApiPrefixes = ['/api/auth'];
const adminPrefixes = ['/admin', '/api/admin'];
const adminRoles = ['admin', 'super_admin'];

function isPublicPath(pathname: string) {
  return publicPaths.includes(pathname) || publicApiPrefixes.some((prefix) => pathname.startsWith(prefix));
}

function isAdminPath(pathname: string) {
  return adminPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get('satguru_role')?.value;
  const hasSession = Boolean(request.cookies.get('satguru_session')?.value);

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (!hasSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAdminPath(pathname) && !adminRoles.includes(role ?? '')) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ message: 'Admin access required.' }, { status: 403 });
    }

    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
