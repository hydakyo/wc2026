import { NextResponse } from 'next/server';
import { groups, tableFor, thirdPlaceRanking } from '@/lib/worldcup-data';

export function GET() {
  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    groups: Object.fromEntries(groups.map((group) => [group, tableFor(group)])),
    thirdPlaceRanking: thirdPlaceRanking()
  });
}
