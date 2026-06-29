import { BracketView } from '@/components/BracketView';
import { DataSourceBanner } from '@/components/DataSourceBanner';
import { Shell } from '@/components/Shell';
import { getTournamentData } from '@/lib/live-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BracketPage() {
  const data = await getTournamentData();
  return (
    <Shell title="Nhánh đấu knock-out" subtitle="Sơ đồ từ vòng 32 đội đến chung kết. Các suất chờ xác định được hiển thị rõ để tránh nhầm lẫn giữa dự kiến và dữ liệu chính thức.">
      <DataSourceBanner source={data.source} />
      <div className="card"><BracketView data={data} /></div>
    </Shell>
  );
}
