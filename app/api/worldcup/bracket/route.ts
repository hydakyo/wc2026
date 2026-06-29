import { NextResponse } from 'next/server';
import { getTournamentData } from '@/lib/live-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const data = await getTournamentData();
  return NextResponse.json({ generatedAt: new Date().toISOString(), source: data.source, mode: data.source.configured ? 'provider' : 'mock', bracket: data.bracket }, { headers: { 'Cache-Control': 'no-store' } });
}
