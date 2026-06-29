import { DataSourceBanner } from '@/components/DataSourceBanner';
import { Shell } from '@/components/Shell';
import { QualifiedPanel, StandingsGrid, ThirdPlaceRace } from '@/components/StandingsViews';
import { getProductionTournamentData } from '@/lib/production-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StandingsPage() {
  const data = await getProductionTournamentData();
  return (
    <Shell title="Bảng xếp hạng" subtitle="Toàn bộ bảng đấu, nhóm top 2 đi tiếp và cuộc đua top 8 đội hạng ba tốt nhất.">
      <DataSourceBanner source={data.source} />
      <section className="grid two-col"><QualifiedPanel data={data} /><ThirdPlaceRace data={data} /></section>
      <StandingsGrid data={data} />
    </Shell>
  );
}
