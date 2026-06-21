import { NextResponse } from 'next/server';

import { RESET_TTL_MS, decodeToken, encodeToken, isAllowedEmail, normalizeEmail } from '@/lib/auth-flow';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body.email);
    const otp = String(body.otp || '').trim();
    const verificationToken = String(body.verificationToken || '');
    const payload = decodeToken(verificationToken);

    if (!isAllowedEmail(email)) {
      return NextResponse.json({ message: 'Verification is allowed only with an approved official domain.' }, { status: 400 });
    }

    if (!payload || payload.purpose !== 'signup_otp' || payload.email !== email || payload.otp !== otp) {
      return NextResponse.json({ message: 'Invalid or expired OTP. Please generate a new OTP.' }, { status: 400 });
    }

    const passwordSetupToken = encodeToken({
      purpose: 'set_password',
      email,
      fullName: payload.fullName,
      mobile: payload.mobile,
      department: payload.department,
      branch: payload.branch,
      country: payload.country
    }, RESET_TTL_MS);

    return NextResponse.json({ message: 'OTP verified successfully.', passwordSetupToken });
  } catch {
    return NextResponse.json({ message: 'Unable to verify OTP. Please try again.' }, { status: 500 });
  }
}
