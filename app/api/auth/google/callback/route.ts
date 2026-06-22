import { NextResponse } from 'next/server';

import { getPortalUserByEmail, upsertPortalUser } from '@/lib/supabase-admin';
import { createSessionToken, fallbackName, isAllowedEmail, normalizeEmail, sessionCookieOptions } from '@/lib/auth-flow';

const primarySuperAdminEmail = 'admin@satguruai.com';

type GoogleUserInfo = {
  email?: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
};

function getBaseUrl(request: Request) {
  return new URL(request.url).origin;
}

function normalizeRole(role: unknown, email: string) {
  if (email === primarySuperAdminEmail) return 'super_admin' as const;
  return role === 'super_admin' || role === 'admin' ? role : 'user';
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const baseUrl = getBaseUrl(request);
  const code = requestUrl.searchParams.get('code');
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=Google login was cancelled or failed.', baseUrl));
  }

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/login?error=Google login is not configured.', baseUrl));
  }

  try {
    const redirectUri = `${baseUrl}/api/auth/google/callback`;
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });

    if (!tokenResponse.ok) {
      return NextResponse.redirect(new URL('/login?error=Unable to complete Google login.', baseUrl));
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token as string | undefined;

    if (!accessToken) {
      return NextResponse.redirect(new URL('/login?error=Google did not return an access token.', baseUrl));
    }

    const userResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!userResponse.ok) {
      return NextResponse.redirect(new URL('/login?error=Unable to read Google profile.', baseUrl));
    }

    const userInfo = (await userResponse.json()) as GoogleUserInfo;
    const email = normalizeEmail(userInfo.email);
    const name = String(userInfo.name || fallbackName(email));
    const picture = String(userInfo.picture || '');
    const lastLogin = new Date().toISOString();

    if (!email || !userInfo.email_verified) {
      return NextResponse.redirect(new URL('/login?error=Google email is not verified.', baseUrl));
    }

    if (!isAllowedEmail(email)) {
      return NextResponse.redirect(new URL('/login?error=This Google email domain is not allowed.', baseUrl));
    }

    const existingUser = await getPortalUserByEmail(email);
    const role = normalizeRole(existingUser?.role, email);
    const status = existingUser?.status === 'inactive' || existingUser?.status === 'disabled' ? 'inactive' : 'active';

    if (status === 'inactive') {
      return NextResponse.redirect(new URL('/login?error=Your account is inactive. Please contact administrator.', baseUrl));
    }

    await upsertPortalUser({
      email,
      name,
      picture,
      role,
      status: 'active',
      login_method: 'google',
      last_login: lastLogin
    });

    const sessionToken = createSessionToken({
      email,
      name,
      picture,
      role,
      status: 'active',
      loginMethod: 'google',
      lastLogin
    }, true);

    const response = NextResponse.redirect(new URL('/dashboard', baseUrl));
    response.cookies.set('satguru_session', sessionToken, sessionCookieOptions(true));
    return response;
  } catch {
    return NextResponse.redirect(new URL('/login?error=Unexpected Google login error.', baseUrl));
  }
}
