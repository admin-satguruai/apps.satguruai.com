import { NextResponse } from 'next/server';

import { upsertPortalUser } from '@/lib/supabase-admin';
import { PRIMARY_SUPER_ADMIN_EMAIL } from '@/lib/auth';
import { cookieOptions, createSessionToken, decodeToken, fallbackName, isAllowedEmail, normalizeEmail, safeCookieValue } from '@/lib/auth-flow';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body.email);
    const otp = String(body.otp || '').trim();
    const verificationToken = String(body.verificationToken || '');
    const payload = decodeToken(verificationToken);

    if (!isAllowedEmail(email)) {
      return NextResponse.json({ message: 'Verification is allowed only with an approved official domain.' }, { status: 400 });
    }

    if (!payload || !['signup_otp', 'login_otp'].includes(String(payload.purpose)) || payload.email !== email || payload.otp !== otp) {
      return NextResponse.json({ message: 'Invalid or expired verification code. Please generate a new code.' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const name = String(payload.fullName || fallbackName(email));
    const role = email === PRIMARY_SUPER_ADMIN_EMAIL ? 'super_admin' : 'user';
    const department = String(payload.department || 'To be updated');
    const branch = String(payload.branch || 'To be updated');
    const country = String(payload.country || 'To be updated');

    await upsertPortalUser({
      email,
      name,
      role,
      status: 'active',
      login_method: String(payload.purpose) === 'signup_otp' ? 'email_signup' : 'email',
      last_login: now
    });

    const sessionToken = createSessionToken({
      email,
      name,
      role,
      loginMethod: String(payload.purpose) === 'signup_otp' ? 'email_signup' : 'email',
      lastLogin: now,
      department,
      branch,
      country
    });

    const response = NextResponse.json({ message: 'Verification completed successfully.', redirectTo: '/dashboard' });
    response.cookies.set('satguru_session', sessionToken, cookieOptions);
    response.cookies.set('satguru_role', role, cookieOptions);
    response.cookies.set('satguru_user_email', safeCookieValue(email), cookieOptions);
    response.cookies.set('satguru_user_name', safeCookieValue(name), cookieOptions);
    response.cookies.set('satguru_login_method', String(payload.purpose) === 'signup_otp' ? 'email_signup' : 'email', cookieOptions);
    response.cookies.set('satguru_last_login', safeCookieValue(now), cookieOptions);

    return response;
  } catch {
    return NextResponse.json({ message: 'Unable to verify code. Please try again.' }, { status: 500 });
  }
}
