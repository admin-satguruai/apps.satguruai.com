import { NextResponse } from 'next/server';

import { ALLOWED_DOMAINS, TOKEN_TTL_MS, encodeToken, fallbackName, isAllowedEmail, makeOtp, normalizeEmail, sendEmail } from '@/lib/auth-flow';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = normalizeEmail(body.email);

    if (!email || !isAllowedEmail(email)) {
      return NextResponse.json({ ok: false, message: `Only approved Satguru domains can access this portal: ${ALLOWED_DOMAINS.join(', ')}.` }, { status: 400 });
    }

    const code = makeOtp();
    const verificationToken = encodeToken({ purpose: 'login_otp', email, otp: code, fullName: fallbackName(email) }, TOKEN_TTL_MS);

    await sendEmail(
      email,
      'Satguru AI login verification code',
      `Your Satguru AI login verification code is ${code}. It expires in 10 minutes.`
    );

    return NextResponse.json({ ok: true, message: 'Verification code sent successfully to your official email ID.', verificationToken, redirectTo: `/verify-otp?email=${encodeURIComponent(email)}` });
  } catch (error) {
    return NextResponse.json({ ok: false, message: error instanceof Error ? error.message : 'Unable to send login verification code. Please try again.' }, { status: 500 });
  }
}
