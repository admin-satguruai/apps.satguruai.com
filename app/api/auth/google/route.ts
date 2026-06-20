import { NextResponse } from 'next/server';

const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

function getBaseUrl(request: Request) {
  return new URL(request.url).origin;
}

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const baseUrl = getBaseUrl(request);

  if (!clientId) {
    return NextResponse.redirect(new URL('/login?error=Google login is not configured.', baseUrl));
  }

  const redirectUri = `${baseUrl}/api/auth/google/callback`;
  const authUrl = new URL(googleAuthUrl);
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'select_account');

  return NextResponse.redirect(authUrl);
}
