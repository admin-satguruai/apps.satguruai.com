import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

function readCookie(name: string) {
  return cookies().get(name)?.value || '';
}

function decodeValue(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function GET() {
  const session = readCookie('satguru_session');
  const role = readCookie('satguru_role');
  const email = decodeValue(readCookie('satguru_user_email'));
  const name = decodeValue(readCookie('satguru_user_name'));
  const loginMethod = readCookie('satguru_login_method');

  return NextResponse.json({
    hasSession: Boolean(session),
    session: session || null,
    role: role || null,
    email: email || null,
    name: name || null,
    loginMethod: loginMethod || null
  });
}
