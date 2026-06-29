import { MatchExplorer } from '@/components/MatchExplorer';
import { Shell } from '@/components/Shell';

export default function MatchesPage() {
  return (
    <Shell title="Trung tâm trận đấu" subtitle="Lọc trận đang đá, đã kết thúc và sắp đá theo trạng thái hoặc theo bảng.">
      <MatchExplorer />
    </Shell>
  );
}
