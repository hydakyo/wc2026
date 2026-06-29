import { NextResponse } from 'next/server';
import { getTournamentData, qualifiedTeamsForData, thirdPlaceRankingForData, tournamentSummaryForData } from '@/lib/live-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const data = await getTournamentData();
  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    source: data.source,
    summary: tournamentSummaryForData(data),
    qualified: qualifiedTeamsForData(data),
    thirdPlaceRanking: thirdPlaceRankingForData(data)
  }, { headers: { 'Cache-Control': 'no-store' } });
}
