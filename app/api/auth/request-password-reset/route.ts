import { NextResponse } from 'next/server';

import { getPortalUserByEmail } from '@/lib/supabase-admin';
import { RESET_TTL_MS, encodeToken, isAllowedEmail, normalizeEmail, sendEmail } from '@/lib/auth-flow';

function resetEmailText(link: string) {
  return [
    'Reset your Satguru AI password using the secure link below:',
    '',
    link,
    '',
    'This link will expire in 30 minutes.',
    'If you did not request this, please ignore this email.'
  ].join('\n');
}

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
      const origin = (process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin).replace(/\/$/, '');
      const link = `${origin}/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(resetToken)}`;
      await sendEmail(email, 'Satguru AI password reset', resetEmailText(link));
    }

    return NextResponse.json({ message: 'If this email is registered, a reset link has been sent.' });
  } catch {
    return NextResponse.json({ message: 'If this email is registered, a reset link has been sent.' });
  }
}
