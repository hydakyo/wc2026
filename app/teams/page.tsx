import { AnalyticsViews } from '@/components/AnalyticsViews';
import { Shell } from '@/components/Shell';
import { TeamExplorer } from '@/components/TeamExplorer';

export default function TeamsPage() {
  return (
    <Shell title="Team Intelligence" subtitle="Search and compare teams by group, form, goals, defensive profile and tournament status.">
      <TeamExplorer />
      <AnalyticsViews />
    </Shell>
  );
}
