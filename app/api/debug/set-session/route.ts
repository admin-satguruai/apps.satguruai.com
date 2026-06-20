import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      disabled: true,
      message: 'Temporary session setter has been disabled.'
    },
    { status: 410 }
  );
}
