import { Shell } from '@/components/Shell';
import { QualifiedPanel, StandingsGrid, ThirdPlaceRace } from '@/components/StandingsViews';

export default function StandingsPage() {
  return (
    <Shell title="Bảng xếp hạng" subtitle="Toàn bộ bảng đấu, nhóm top 2 đi tiếp và cuộc đua top 8 đội hạng ba tốt nhất.">
      <section className="grid two-col"><QualifiedPanel /><ThirdPlaceRace /></section>
      <StandingsGrid />
    </Shell>
  );
}
