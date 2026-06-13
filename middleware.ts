import { NextResponse, type NextRequest } from 'next/server';

const publicPaths = ['/', '/login', '/signup', '/verify-otp', '/forgot-password'];
const authApiPrefix = '/api/auth';
const adminPrefix = '/admin';

function isPublicPath(pathname: string) {
  return publicPaths.includes(pathname) || pathname.startsWith(authApiPrefix);
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

  if (pathname.startsWith(adminPrefix) && !['admin', 'super_admin'].includes(role ?? '')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
