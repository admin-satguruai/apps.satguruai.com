import { NextResponse } from 'next/server';

import { upsertPortalUser } from '@/lib/supabase-admin';
import { createSessionToken, fallbackName, isAllowedEmail, normalizeEmail, sessionCookieOptions } from '@/lib/auth-flow';

const primarySuperAdminEmail = 'admin@satguruai.com';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = normalizeEmail(body.email);
  const rememberMe = Boolean(body.rememberMe);

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
    login_method: rememberMe ? 'email_remembered' : 'email',
    last_login: now
  });

  const sessionToken = createSessionToken({
    email,
    name,
    role,
    status: 'active',
    loginMethod: rememberMe ? 'email_remembered' : 'email',
    lastLogin: now
  }, rememberMe);

  const response = NextResponse.json({ ok: true, redirectTo: '/dashboard' });
  response.cookies.set('satguru_session', sessionToken, sessionCookieOptions(rememberMe));
  return response;
}
