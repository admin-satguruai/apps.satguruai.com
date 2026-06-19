import { NextResponse } from 'next/server';

const allowedDomains = ['satgurutravel.com', 'satguruai.com'];

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

    if (!email || !userInfo.email_verified) {
      return NextResponse.redirect(new URL('/login?error=Google email is not verified.', baseUrl));
    }

    if (!isAllowedEmail(email)) {
      return NextResponse.redirect(new URL('/login?error=This Google email domain is not allowed.', baseUrl));
    }

    const response = NextResponse.redirect(new URL('/dashboard', baseUrl));
    response.cookies.set('satguru_session', 'google', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60,
      path: '/'
    });
    response.cookies.set('satguru_role', 'user', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60,
      path: '/'
    });
    response.cookies.set('satguru_user_email', email, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60,
      path: '/'
    });

    return response;
  } catch {
    return NextResponse.redirect(new URL('/login?error=Unexpected Google login error.', baseUrl));
  }
}
