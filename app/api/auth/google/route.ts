import { NextResponse } from 'next/server';

const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

function cleanBaseUrl(url?: string) {
  if (!url) return '';
  const trimmed = url.trim().replace(/\/$/, '');
  if (!trimmed) return '';
  return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
}

function getBaseUrl(request: Request) {
  return cleanBaseUrl(process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL) || new URL(request.url).origin;
}

function getRedirectUri(request: Request) {
  return cleanBaseUrl(process.env.GOOGLE_REDIRECT_URI) || `${getBaseUrl(request)}/api/auth/google/callback`;
}

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const baseUrl = getBaseUrl(request);

  if (!clientId) {
    return NextResponse.redirect(new URL('/login?error=Google login is not configured.', baseUrl));
  }

  const redirectUri = getRedirectUri(request);
  const authUrl = new URL(googleAuthUrl);
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'select_account');

  return NextResponse.redirect(authUrl);
}