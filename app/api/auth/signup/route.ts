import { NextResponse } from 'next/server';

import { getPortalUserByEmail } from '@/lib/supabase-admin';
import { ALLOWED_DOMAINS, TOKEN_TTL_MS, encodeToken, isAllowedEmail, makeOtp, normalizeEmail, sendEmail } from '@/lib/auth-flow';

function safeSmtpDetail(error: unknown) {
  const raw = error instanceof Error ? error.message : String(error || 'Unknown SMTP error');
  return raw
    .replace(/\b[A-Za-z0-9+/=]{12,}\b/g, '[hidden]')
    .replace(/\b[A-Fa-f0-9]{16,}\b/g, '[hidden]')
    .slice(0, 360);
}

function smtpFailureMessage(error: unknown) {
  const reason = error instanceof Error ? error.message : '';
  const lowerReason = reason.toLowerCase();
  const detail = safeSmtpDetail(error);

  if (lowerReason.includes('configured')) {
    return `OTP email service is not configured yet. Please configure SMTP_USER, SMTP_PASSWORD, EMAIL_FROM_ADDRESS, AUTH_SECRET, and NEXT_PUBLIC_APP_URL in Vercel environment variables. Diagnostic: ${detail}`;
  }

  if (lowerReason.includes('invalid login') || lowerReason.includes('username and password not accepted') || lowerReason.includes('535')) {
    return `Google rejected the SMTP login. Please regenerate a Google App Password from noreply@satguruai.com and update SMTP_PASSWORD in Vercel. Do not use the normal mailbox password. Diagnostic: ${detail}`;
  }

  if (lowerReason.includes('connection') || lowerReason.includes('timeout') || lowerReason.includes('etimedout') || lowerReason.includes('econn')) {
    return `SMTP connection failed. Please check SMTP_HOST=smtp.gmail.com, SMTP_PORT=465, and SMTP_SECURE=true in Vercel, then redeploy. Diagnostic: ${detail}`;
  }

  console.error('Signup OTP email failure:', reason);
  return `Unable to send OTP email right now. SMTP diagnostic: ${detail}`;
}

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

    try {
      await sendEmail(
        email,
        'Satguru AI signup OTP',
        `Your Satguru AI signup OTP is ${otp}. This OTP will expire in 10 minutes. If you did not request this, please ignore this email.`
      );
    } catch (emailError) {
      return NextResponse.json({ message: smtpFailureMessage(emailError) }, { status: 502 });
    }

    return NextResponse.json({ message: 'OTP sent successfully to your official email ID.', verificationToken });
  } catch {
    return NextResponse.json({ message: 'Unable to send OTP. Please try again or contact administrator.' }, { status: 500 });
  }
}
