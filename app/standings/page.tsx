import { Shell } from '@/components/Shell';
import { QualifiedPanel, StandingsGrid, ThirdPlaceRace } from '@/components/StandingsViews';

export default function StandingsPage() {
  return (
    <Shell title="Standings Control" subtitle="Full group tables, top-two qualification view and best third-place race for the 48-team format.">
      <section className="grid two-col"><QualifiedPanel /><ThirdPlaceRace /></section>
      <StandingsGrid />
    </Shell>
  );
}
