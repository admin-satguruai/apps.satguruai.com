import { NextResponse } from 'next/server';
import { upsertPortalUser } from '@/lib/supabase-admin';

const allowedDomains = ['satgurutravel.com', 'satguruai.com'];

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 24 * 60 * 60,
  path: '/'
};

type GoogleUserInfo = {
  email?: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
};

function getBaseUrl(request: Request) {
  return process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
}

function isAllowedEmail(email: string) {
  return allowedDomains.some((domain) => email.toLowerCase().endsWith(`@${domain}`));
}

function safeCookieValue(value: string) {
  return encodeURIComponent(value).slice(0, 3500);
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
    return NextResponse.redirect(
      new URL('/login?error=Google login is not configured. Add Google OAuth credentials in Vercel.', baseUrl)
    );
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
    const email = String(userInfo.email || '').toLowerCase();
    const name = String(userInfo.name || email.split('@')[0] || 'Satguru User');
    const picture = String(userInfo.picture || '');
    const lastLogin = new Date().toISOString();

    if (!email || !userInfo.email_verified) {
      return NextResponse.redirect(new URL('/login?error=Google email is not verified.', baseUrl));
    }

    if (!isAllowedEmail(email)) {
      return NextResponse.redirect(new URL('/login?error=This Google email domain is not allowed.', baseUrl));
    }

    await upsertPortalUser({
      email,
      name,
      picture,
      role: 'user',
      status: 'active',
      login_method: 'google',
      last_login: lastLogin
    });

    const response = NextResponse.redirect(new URL('/dashboard', baseUrl));
    response.cookies.set('satguru_session', 'google', cookieOptions);
    response.cookies.set('satguru_role', 'user', cookieOptions);
    response.cookies.set('satguru_user_email', safeCookieValue(email), cookieOptions);
    response.cookies.set('satguru_user_name', safeCookieValue(name), cookieOptions);
    response.cookies.set('satguru_user_picture', safeCookieValue(picture), cookieOptions);
    response.cookies.set('satguru_login_method', 'google', cookieOptions);
    response.cookies.set('satguru_last_login', safeCookieValue(lastLogin), cookieOptions);

    return response;
  } catch {
    return NextResponse.redirect(new URL('/login?error=Unexpected Google login error.', baseUrl));
  }
}
