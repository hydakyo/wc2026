import { NextResponse } from 'next/server';
import { bracket } from '@/lib/worldcup-data';

export function GET() {
  return NextResponse.json({ generatedAt: new Date().toISOString(), mode: 'projected', bracket });
}
