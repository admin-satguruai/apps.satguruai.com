import { NextResponse, type NextRequest } from 'next/server';

const publicPaths = ['/', '/login', '/signup', '/verify-otp', '/set-password', '/forgot-password', '/reset-password', '/contact'];
const publicApiPrefixes = ['/api/auth'];

type SessionPayload = {
  purpose?: string;
  email?: string;
  role?: string;
  status?: string;
  exp?: number;
};

function cleanEnv(value: string | undefined) {
  return String(value || '').trim().replace(/^[']|[']$/g, '').replace(/^["]|["]$/g, '');
}

function getAuthSecret() {
  return cleanEnv(process.env.AUTH_SECRET) || cleanEnv(process.env.GOOGLE_CLIENT_SECRET);
}

function isPublicPath(pathname: string) {
  return publicPaths.includes(pathname) || publicApiPrefixes.some((prefix) => pathname.startsWith(prefix));
}

function toHex(bytes: ArrayBuffer) {
  return Array.from(new Uint8Array(bytes)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function decodeBase64Url(value: string) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  return atob(base64);
}

async function sign(body: string, secret: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return toHex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body)));
}

async function readSession(request: NextRequest): Promise<SessionPayload | null> {
  const token = request.cookies.get('satguru_session')?.value || '';
  const secret = getAuthSecret();
  const [body, signature] = token.split('.');

  if (!secret || !body || !signature) return null;
  if (await sign(body, secret) !== signature) return null;

  try {
    const payload = JSON.parse(decodeBase64Url(body)) as SessionPayload;
    if (payload.purpose !== 'session') return null;
    if (!payload.email || !payload.exp || Date.now() > Number(payload.exp)) return null;
    if (payload.status === 'inactive' || payload.status === 'disabled') return null;
    return payload;
  } catch {
    return null;
  }
}

function adminDenied(request: NextRequest, isApi: boolean) {
  if (isApi) {
    return NextResponse.json({ ok: false, message: 'Admin access is required.' }, { status: 403 });
  }

  return NextResponse.redirect(new URL('/dashboard', request.url));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminApi = pathname.startsWith('/api/admin');
  const isProtected = !isPublicPath(pathname);

  if (!isProtected && !isAdminApi) {
    return NextResponse.next();
  }

  const session = await readSession(request);

  if (!session) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ ok: false, message: 'Login is required.' }, { status: 401 });
    }

    return NextResponse.redirect(new URL('/login', request.url));
  }

  if ((pathname.startsWith('/admin') || isAdminApi) && !['admin', 'super_admin'].includes(String(session.role || ''))) {
    return adminDenied(request, isAdminApi);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};