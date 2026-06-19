import { NextResponse } from 'next/server';

const authCookies = [
  'satguru_session',
  'satguru_role',
  'satguru_user_email',
  'satguru_user_name',
  'satguru_user_picture',
  'satguru_login_method',
  'satguru_last_login'
];

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL('/login', request.url));

  for (const cookie of authCookies) {
    response.cookies.set(cookie, '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
      path: '/'
    });
  }

  return response;
}
