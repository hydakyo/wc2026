import { AnalyticsViews } from '@/components/AnalyticsViews';
import { Shell } from '@/components/Shell';
import { TeamExplorer } from '@/components/TeamExplorer';

export default function TeamsPage() {
  return (
    <Shell title="Ph\u00e2n t\u00edch \u0111\u1ed9i tuy\u1ec3n" subtitle="T\u00ecm ki\u1ebfm v\u00e0 so s\u00e1nh \u0111\u1ed9i tuy\u1ec3n theo b\u1ea3ng, phong \u0111\u1ed9, b\u00e0n th\u1eafng, ph\u00f2ng ng\u1ef1 v\u00e0 t\u00ecnh tr\u1ea1ng t\u1ea1i gi\u1ea3i.">
      <TeamExplorer />
      <AnalyticsViews />
    </Shell>
  );
}
