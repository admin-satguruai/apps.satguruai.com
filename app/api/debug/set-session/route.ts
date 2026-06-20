import { NextResponse } from 'next/server';

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 24 * 60 * 60,
  path: '/'
};

function safeCookieValue(value: string) {
  return encodeURIComponent(value).slice(0, 3500);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const confirm = url.searchParams.get('confirm');

  if (confirm !== 'set-admin-session') {
    return NextResponse.json({
      ready: false,
      message: 'Add ?confirm=set-admin-session to test whether this domain can store session cookies.'
    });
  }

  const response = NextResponse.redirect(new URL('/api/debug/session', url.origin));
  response.cookies.set('satguru_session', 'debug', cookieOptions);
  response.cookies.set('satguru_role', 'super_admin', cookieOptions);
  response.cookies.set('satguru_user_email', safeCookieValue('admin@satguruai.com'), cookieOptions);
  response.cookies.set('satguru_user_name', safeCookieValue('Admin Satguru AI'), cookieOptions);
  response.cookies.set('satguru_login_method', 'debug', cookieOptions);
  response.cookies.set('satguru_last_login', safeCookieValue(new Date().toISOString()), cookieOptions);

  return response;
}
