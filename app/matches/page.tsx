import { DataSourceBanner } from '@/components/DataSourceBanner';
import { MatchExplorer } from '@/components/MatchExplorer';
import { Shell } from '@/components/Shell';
import { getTournamentData } from '@/lib/live-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function MatchesPage() {
  const data = await getTournamentData();
  return (
    <Shell title="Trung tâm trận đấu" subtitle="Lọc trận đang đá, đã kết thúc và sắp đá theo trạng thái hoặc theo bảng.">
      <DataSourceBanner source={data.source} />
      <MatchExplorer data={data} />
    </Shell>
  );
}
