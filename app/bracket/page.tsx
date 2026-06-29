import { BracketView } from '@/components/BracketView';
import { Shell } from '@/components/Shell';

export default function BracketPage() {
  return (
    <Shell title="Nhánh đấu knock-out" subtitle="Sơ đồ từ vòng 32 đội đến chung kết. Các suất chờ xác định được hiển thị rõ để tránh nhầm lẫn giữa dự kiến và dữ liệu chính thức.">
      <div className="card"><BracketView /></div>
    </Shell>
  );
}
