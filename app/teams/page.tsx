import { AnalyticsViews } from '@/components/AnalyticsViews';
import { DataSourceBanner } from '@/components/DataSourceBanner';
import { Shell } from '@/components/Shell';
import { TeamExplorer } from '@/components/TeamExplorer';
import { getTournamentData } from '@/lib/live-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TeamsPage() {
  const data = await getTournamentData();
  return (
    <Shell title="Phân tích đội tuyển" subtitle="Tìm kiếm và so sánh đội tuyển theo bảng, phong độ, bàn thắng, phòng ngự và tình trạng tại giải.">
      <DataSourceBanner source={data.source} />
      <TeamExplorer data={data} />
      <AnalyticsViews data={data} />
    </Shell>
  );
}
