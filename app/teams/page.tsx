import { AnalyticsViews } from '@/components/AnalyticsViews';
import { Shell } from '@/components/Shell';
import { TeamExplorer } from '@/components/TeamExplorer';

export default function TeamsPage() {
  return (
    <Shell title="Phân tích đội tuyển" subtitle="Tìm kiếm và so sánh đội tuyển theo bảng, phong độ, bàn thắng, phòng ngự và tình trạng tại giải.">
      <TeamExplorer />
      <AnalyticsViews />
    </Shell>
  );
}
