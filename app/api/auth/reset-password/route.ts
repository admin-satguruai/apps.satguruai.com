import { NextResponse } from 'next/server';

import { getPortalUserByEmail, upsertPortalUser } from '@/lib/supabase-admin';
import { decodeToken, normalizeEmail, validatePassword } from '@/lib/auth-flow';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body.email);
    const token = String(body.token || '');
    const first = String(body.first || '');
    const second = String(body.second || '');
    const payload = decodeToken(token);

    if (!payload || payload.purpose !== 'reset_password' || payload.email !== email) {
      return NextResponse.json({ message: 'Reset link is invalid or expired. Please request a new link.' }, { status: 400 });
    }

    if (first !== second) return NextResponse.json({ message: 'Both password entries must match.' }, { status: 400 });
    const issues = validatePassword(first);
    if (issues.length) return NextResponse.json({ message: `Password must include ${issues.join(', ')}.` }, { status: 400 });

    const user = await getPortalUserByEmail(email);
    if (!user) return NextResponse.json({ message: 'Reset link is invalid or expired. Please request a new link.' }, { status: 400 });

    await upsertPortalUser({ email, name: user.name || email, role: user.role || 'user', status: 'active', login_method: 'email_password' });
    return NextResponse.json({ ok: true, message: 'Password reset successfully. Please login with your new password.' });
  } catch {
    return NextResponse.json({ message: 'Unable to reset password. Please try again.' }, { status: 500 });
  }
}
