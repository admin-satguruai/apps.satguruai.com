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

function cleanBaseUrl(url?: string) {
  if (!url) return '';
  const trimmed = url.trim().replace(/\/$/, '');
  if (!trimmed) return '';
  return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
}

function getRequestOrigin(request: Request) {
  return new URL(request.url).origin;
}

function getBaseUrl(request: Request) {
  return cleanBaseUrl(process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL) || getRequestOrigin(request);
}

function getRedirectUri(request: Request) {
  return cleanBaseUrl(process.env.GOOGLE_REDIRECT_URI) || `${getBaseUrl(request)}/api/auth/google/callback`;
}

function normalizeRole(role: unknown, email: string) {
  if (email === primarySuperAdminEmail) return 'super_admin' as const;
  return role === 'super_admin' || role === 'admin' ? role : 'user';
}

function loginRedirect(request: Request, message: string) {
  return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(message)}`, getRequestOrigin(request)));
}

function safeGoogleError(error: unknown) {
  const raw = error instanceof Error ? error.message : String(error || 'Unknown error');
  return raw
    .replace(/client_secret=[^&\s]+/gi, 'client_secret=[hidden]')
    .replace(/access_token[^&\s]+/gi, 'access_token[hidden]')
    .replace(/refresh_token[^&\s]+/gi, 'refresh_token[hidden]')
    .slice(0, 180);
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const oauthError = requestUrl.searchParams.get('error');
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (oauthError) {
    return loginRedirect(request, `Google login was cancelled or failed: ${oauthError}.`);
  }

  if (!code) {
    return loginRedirect(request, 'Google login was cancelled or failed.');
  }

  if (!clientId || !clientSecret) {
    return loginRedirect(request, 'Google login is not configured.');
  }

  try {
    const redirectUri = getRedirectUri(request);
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
      const details = await tokenResponse.text().catch(() => 'No detail returned by Google.');
      console.error('Google token exchange failed:', details);
      return loginRedirect(request, 'Unable to complete Google login. Please check the Google redirect URI configured in Google Cloud and Vercel.');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token as string | undefined;

    if (!accessToken) {
      return loginRedirect(request, 'Google did not return an access token.');
    }

    const userResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!userResponse.ok) {
      const details = await userResponse.text().catch(() => 'No detail returned by Google.');
      console.error('Google profile read failed:', details);
      return loginRedirect(request, 'Unable to read Google profile.');
    }

    const userInfo = (await userResponse.json()) as GoogleUserInfo;
    const email = normalizeEmail(userInfo.email);
    const name = String(userInfo.name || fallbackName(email));
    const picture = String(userInfo.picture || '');
    const lastLogin = new Date().toISOString();

    if (!email || !userInfo.email_verified) {
      return loginRedirect(request, 'Google email is not verified.');
    }

    if (!isAllowedEmail(email)) {
      return loginRedirect(request, 'This Google email domain is not allowed.');
    }

    const existingUser = await getPortalUserByEmail(email);
    const role = normalizeRole(existingUser?.role, email);
    const status = existingUser?.status === 'inactive' || existingUser?.status === 'disabled' ? 'inactive' : 'active';

    if (status === 'inactive') {
      return loginRedirect(request, 'Your account is inactive. Please contact administrator.');
    }

    const saveResult = await upsertPortalUser({
      email,
      name,
      picture,
      role,
      status: 'active',
      login_method: 'google',
      last_login: lastLogin
    });

    if (!saveResult.saved) {
      console.error('Google login continued without saving portal user:', saveResult.reason);
    }

    const sessionToken = createSessionToken({
      email,
      name,
      picture,
      role,
      status: 'active',
      loginMethod: 'google',
      lastLogin
    }, true);

    const response = NextResponse.redirect(new URL('/dashboard', getRequestOrigin(request)));
    response.cookies.set('satguru_session', sessionToken, sessionCookieOptions(true));
    return response;
  } catch (error) {
    const detail = safeGoogleError(error);
    console.error('Unexpected Google login callback failure:', detail);
    return loginRedirect(request, `Google login failed during callback: ${detail}`);
  }
}
