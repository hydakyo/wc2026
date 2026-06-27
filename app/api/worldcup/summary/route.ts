import { NextResponse } from 'next/server';
import { qualifiedTeams, thirdPlaceRanking, tournamentSummary } from '@/lib/worldcup-data';

export function GET() {
  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    summary: tournamentSummary(),
    qualified: qualifiedTeams(),
    thirdPlaceRanking: thirdPlaceRanking()
  });
}
