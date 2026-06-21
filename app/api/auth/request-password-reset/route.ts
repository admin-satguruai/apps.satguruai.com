import { NextResponse } from 'next/server';

import { getPortalUserByEmail } from '@/lib/supabase-admin';
import { RESET_TTL_MS, decodeToken, encodeToken, isAllowedEmail, normalizeEmail, sendEmail } from '@/lib/auth-flow';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body.email);

    if (!email || !isAllowedEmail(email)) {
      return NextResponse.json({ message: 'If this email is registered, a reset link has been sent.' });
    }

    const user = await getPortalUserByEmail(email);
    if (user) {
      const resetToken = encodeToken({ purpose: 'reset_password', email }, RESET_TTL_MS);
      const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
      const link = `${origin}/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(resetToken)}`;
      await sendEmail(
        email,
        'Satguru AI password reset',
        `Use this secure link to reset your Satguru AI password: ${link}\n\nThis link will expire in 30 minutes. If you did not request this, please ignore this email.`
      );
    }

    return NextResponse.json({ message: 'If this email is registered, a reset link has been sent.' });
  } catch {
    return NextResponse.json({ message: 'If this email is registered, a reset link has been sent.' });
  }
}

export function verifyResetToken(token: string, email: string) {
  const payload = decodeToken(token);
  return Boolean(payload && payload.purpose === 'reset_password' && payload.email === email);
}
