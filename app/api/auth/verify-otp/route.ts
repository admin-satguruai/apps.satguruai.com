import { createHmac, timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';

function sign(value: string) {
  const secret = process.env.AUTH_SECRET || process.env.EMAIL_PROVIDER_API_KEY || 'development-secret-change-before-production';
  return createHmac('sha256', secret).update(value).digest('hex');
}

function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  return aBuffer.length === bBuffer.length && timingSafeEqual(aBuffer, bBuffer);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();
    const otp = String(body.otp || '').trim();
    const verificationToken = String(body.verificationToken || '');
    const [tokenEmail, expiresAtText, tokenSignature] = verificationToken.split('.');

    if (!email.endsWith('@satgurutravel.com')) {
      return NextResponse.json({ message: 'Verification is allowed only with an official @satgurutravel.com email ID.' }, { status: 400 });
    }

    if (!tokenEmail || !expiresAtText || !tokenSignature || tokenEmail !== email) {
      return NextResponse.json({ message: 'OTP request is invalid. Please generate a new OTP.' }, { status: 400 });
    }

    const expiresAt = Number(expiresAtText);
    if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
      return NextResponse.json({ message: 'OTP expired. Please generate a new OTP.' }, { status: 400 });
    }

    const expectedSignature = sign(`${email}.${expiresAt}.${otp}`);
    if (!safeEqual(expectedSignature, tokenSignature)) {
      return NextResponse.json({ message: 'Invalid OTP. Please check the email OTP and try again.' }, { status: 400 });
    }

    const response = NextResponse.json({ message: 'OTP verified successfully.' });
    response.cookies.set('satguru_session', 'verified', {
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
    return response;
  } catch {
    return NextResponse.json({ message: 'Unable to verify OTP. Please try again.' }, { status: 500 });
  }
}
