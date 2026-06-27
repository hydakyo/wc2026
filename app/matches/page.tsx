import { MatchExplorer } from '@/components/MatchExplorer';
import { Shell } from '@/components/Shell';

export default function MatchesPage() {
  return (
    <Shell title="Match Center" subtitle="Filter live, finished and upcoming matches by status or group. Designed for fast tournament operations visibility.">
      <MatchExplorer />
    </Shell>
  );
}
