import { NextResponse } from 'next/server';
import { upsertPortalUser } from '@/lib/supabase-admin';

const allowedDomains = ['satgurutravel.com', 'satguruai.com'];
const primarySuperAdminEmail = 'admin@satguruai.com';

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 24 * 60 * 60,
  path: '/'
};

function isAllowedEmail(email: string) {
  return allowedDomains.some((domain) => email.toLowerCase().endsWith(`@${domain}`));
}

function safeCookieValue(value: string) {
  return encodeURIComponent(value).slice(0, 3500);
}

function fallbackName(email: string) {
  const localPart = email.split('@')[0] || 'Satguru User';
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || '').trim().toLowerCase();

  if (!email || !isAllowedEmail(email)) {
    return NextResponse.json({ ok: false, message: 'Only approved Satguru domains can access this portal.' }, { status: 400 });
  }

  const now = new Date().toISOString();
  const name = fallbackName(email);
  const role = email === primarySuperAdminEmail ? 'super_admin' : 'user';

  await upsertPortalUser({
    email,
    name,
    role,
    status: 'active',
    login_method: 'email',
    last_login: now
  });

  const response = NextResponse.json({ ok: true, redirectTo: '/dashboard' });
  response.cookies.set('satguru_session', 'email', cookieOptions);
  response.cookies.set('satguru_role', role, cookieOptions);
  response.cookies.set('satguru_user_email', safeCookieValue(email), cookieOptions);
  response.cookies.set('satguru_user_name', safeCookieValue(name), cookieOptions);
  response.cookies.set('satguru_login_method', 'email', cookieOptions);
  response.cookies.set('satguru_last_login', safeCookieValue(now), cookieOptions);

  return response;
}
