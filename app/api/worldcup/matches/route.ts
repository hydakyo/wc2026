import { NextResponse } from 'next/server';
import { matches } from '@/lib/worldcup-data';

export function GET() {
  return NextResponse.json({ generatedAt: new Date().toISOString(), matches });
}
