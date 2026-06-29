import { NextResponse } from 'next/server';
import { getTournamentData, groupsForData, tableForData, thirdPlaceRankingForData } from '@/lib/live-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const data = await getTournamentData();
  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    source: data.source,
    groups: Object.fromEntries(groupsForData(data).map((group) => [group, tableForData(data, group)])),
    thirdPlaceRanking: thirdPlaceRankingForData(data)
  }, { headers: { 'Cache-Control': 'no-store' } });
}
