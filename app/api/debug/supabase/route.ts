import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ disabled: true, message: 'This debug endpoint is disabled.' }, { status: 410 });
}
