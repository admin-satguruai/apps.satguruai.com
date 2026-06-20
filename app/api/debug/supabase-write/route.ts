import { NextResponse } from 'next/server';
import { upsertPortalUser } from '@/lib/supabase-admin';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const confirm = url.searchParams.get('confirm');

  if (confirm !== 'insert-test-user') {
    return NextResponse.json({
      ready: false,
      message: 'Add ?confirm=insert-test-user to create one temporary test user record.'
    });
  }

  const now = new Date().toISOString();
  const result = await upsertPortalUser({
    email: 'debug.portal.user@satguruai.com',
    name: 'Debug Portal User',
    picture: '',
    role: 'user',
    status: 'active',
    login_method: 'debug',
    last_login: now
  });

  return NextResponse.json({
    ready: true,
    saved: result.saved,
    reason: result.saved ? null : result.reason,
    message: result.saved ? 'Temporary test user saved in portal_users.' : 'Temporary test user was not saved.'
  });
}
