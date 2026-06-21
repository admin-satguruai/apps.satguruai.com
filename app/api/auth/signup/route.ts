import { NextResponse } from 'next/server';

import { getPortalUserByEmail } from '@/lib/supabase-admin';
import { ALLOWED_DOMAINS, TOKEN_TTL_MS, encodeToken, isAllowedEmail, makeOtp, normalizeEmail, sendEmail } from '@/lib/auth-flow';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body.email);
    const fullName = String(body.fullName || '').trim();
    const mobile = String(body.mobile || '').trim();
    const department = String(body.department || '').trim();
    const branch = String(body.branch || '').trim();
    const country = String(body.country || '').trim();

    if (!fullName || !email || !department || !branch || !country) {
      return NextResponse.json({ message: 'Full name, official email, department, branch, and country are mandatory.' }, { status: 400 });
    }

    if (!isAllowedEmail(email)) {
      return NextResponse.json({ message: `Self signup is allowed only with approved official domains: ${ALLOWED_DOMAINS.join(', ')}.` }, { status: 400 });
    }

    const existingUser = await getPortalUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ message: 'This email is already registered. Please login or use forgot password.' }, { status: 409 });
    }

    const otp = makeOtp();
    const verificationToken = encodeToken({ purpose: 'signup_otp', email, otp, fullName, mobile, department, branch, country }, TOKEN_TTL_MS);

    await sendEmail(
      email,
      'Satguru AI signup OTP',
      `Your Satguru AI signup OTP is ${otp}. This OTP will expire in 10 minutes. If you did not request this, please ignore this email.`
    );

    return NextResponse.json({ message: 'OTP sent successfully to your official email ID.', verificationToken });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Unable to send OTP. Please try again.' }, { status: 500 });
  }
}
