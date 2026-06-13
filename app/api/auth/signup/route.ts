import { createHmac, randomInt } from 'crypto';
import { NextResponse } from 'next/server';

const ALLOWED_DOMAIN = 'satgurutravel.com';
const TOKEN_TTL_MS = 10 * 60 * 1000;

function sign(value: string) {
  const secret = process.env.AUTH_SECRET || process.env.EMAIL_PROVIDER_API_KEY || 'development-secret-change-before-production';
  return createHmac('sha256', secret).update(value).digest('hex');
}

function createVerificationToken(email: string, otp: string) {
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const payload = `${email}.${expiresAt}.${otp}`;
  return `${email}.${expiresAt}.${sign(payload)}`;
}

async function sendOtpEmail(email: string, otp: string) {
  const apiKey = process.env.EMAIL_PROVIDER_API_KEY;
  const from = process.env.EMAIL_FROM_ADDRESS;

  if (!apiKey || !from) {
    throw new Error('Email provider is not configured. Add EMAIL_PROVIDER_API_KEY and EMAIL_FROM_ADDRESS in Vercel.');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: email,
      subject: 'Satguru AI Central Portal OTP',
      html: `<p>Your Satguru AI Central Portal verification OTP is:</p><h2>${otp}</h2><p>This OTP will expire in 10 minutes.</p>`
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Email provider failed: ${detail}`);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();

    if (!email.endsWith(`@${ALLOWED_DOMAIN}`)) {
      return NextResponse.json(
        { message: 'Self signup is allowed only with an official @satgurutravel.com email ID.' },
        { status: 400 }
      );
    }

    const otp = String(randomInt(100000, 1000000));
    const verificationToken = createVerificationToken(email, otp);
    await sendOtpEmail(email, otp);

    return NextResponse.json({
      message: 'OTP sent successfully to your official email ID.',
      verificationToken
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Unable to send OTP. Please try again.' },
      { status: 500 }
    );
  }
}
