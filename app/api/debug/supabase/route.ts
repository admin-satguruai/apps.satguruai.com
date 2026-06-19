import { NextResponse } from 'next/server';
import { isSupabaseConfigured, listPortalUsers } from '@/lib/supabase-admin';

export async function GET() {
  const configured = isSupabaseConfigured();

  if (!configured) {
    return NextResponse.json({
      configured: false,
      tableReachable: false,
      message: 'Supabase environment variables are missing in this Vercel deployment.'
    });
  }

  const users = await listPortalUsers();

  return NextResponse.json({
    configured: true,
    tableReachable: true,
    userCount: users.length,
    message: 'Supabase is configured and portal_users table was queried.'
  });
}
