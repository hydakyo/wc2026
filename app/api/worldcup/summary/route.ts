import { NextResponse } from 'next/server';
import { getProductionTournamentData, qualifiedTeamsForData, thirdPlaceRankingForData, tournamentSummaryForData } from '@/lib/production-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const data = await getProductionTournamentData();
  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    source: data.source,
    summary: tournamentSummaryForData(data),
    qualified: qualifiedTeamsForData(data),
    thirdPlaceRanking: thirdPlaceRankingForData(data)
  }, { headers: { 'Cache-Control': 'no-store' } });
}
