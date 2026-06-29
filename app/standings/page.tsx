import { Shell } from '@/components/Shell';
import { QualifiedPanel, StandingsGrid, ThirdPlaceRace } from '@/components/StandingsViews';

export default function StandingsPage() {
  return (
    <Shell title="B\u1ea3ng x\u1ebfp h\u1ea1ng" subtitle="To\u00e0n b\u1ed9 b\u1ea3ng \u0111\u1ea5u, nh\u00f3m top 2 \u0111i ti\u1ebfp v\u00e0 cu\u1ed9c \u0111ua top 8 \u0111\u1ed9i h\u1ea1ng ba t\u1ed1t nh\u1ea5t.">
      <section className="grid two-col"><QualifiedPanel /><ThirdPlaceRace /></section>
      <StandingsGrid />
    </Shell>
  );
}
