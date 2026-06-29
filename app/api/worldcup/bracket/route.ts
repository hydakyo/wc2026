import { NextResponse } from 'next/server';
import { getProductionTournamentData } from '@/lib/production-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const data = await getProductionTournamentData();
  return NextResponse.json({ generatedAt: new Date().toISOString(), source: data.source, mode: data.source.configured ? 'provider' : 'unavailable', bracket: data.bracket }, { headers: { 'Cache-Control': 'no-store' } });
}
