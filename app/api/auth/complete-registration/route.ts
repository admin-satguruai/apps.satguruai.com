import { NextResponse } from 'next/server';

import { upsertPortalUser } from '@/lib/supabase-admin';
import { cookieOptions, decodeToken, fallbackName, normalizeEmail, safeCookieValue, validatePassword } from '@/lib/auth-flow';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body.email);
    const first = String(body.first || '');
    const second = String(body.second || '');
    const token = String(body.setupToken || '');
    const payload = decodeToken(token);

    if (!payload || payload.purpose !== 'set_password' || payload.email !== email) {
      return NextResponse.json({ message: 'Setup link is invalid or expired. Please restart signup.' }, { status: 400 });
    }
    if (first !== second) return NextResponse.json({ message: 'Both entries must match.' }, { status: 400 });

    const issues = validatePassword(first);
    if (issues.length) return NextResponse.json({ message: `Password must include ${issues.join(', ')}.` }, { status: 400 });

    const now = new Date().toISOString();
    const name = String(payload.fullName || fallbackName(email));
    await upsertPortalUser({ email, name, role: 'user', status: 'active', login_method: 'email_password', last_login: now });

    const response = NextResponse.json({ ok: true, message: 'Registration completed successfully.' });
    response.cookies.set('satguru_session', 'email_password', cookieOptions);
    response.cookies.set('satguru_role', 'user', cookieOptions);
    response.cookies.set('satguru_user_email', safeCookieValue(email), cookieOptions);
    response.cookies.set('satguru_user_name', safeCookieValue(name), cookieOptions);
    response.cookies.set('satguru_login_method', 'email_password', cookieOptions);
    response.cookies.set('satguru_last_login', safeCookieValue(now), cookieOptions);
    return response;
  } catch {
    return NextResponse.json({ message: 'Unable to complete registration. Please try again.' }, { status: 500 });
  }
}
