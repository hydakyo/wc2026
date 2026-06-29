import { MatchExplorer } from '@/components/MatchExplorer';
import { Shell } from '@/components/Shell';

export default function MatchesPage() {
  return (
    <Shell title="Trung t\u00e2m tr\u1eadn \u0111\u1ea5u" subtitle="L\u1ecdc tr\u1eadn \u0111ang \u0111\u00e1, \u0111\u00e3 k\u1ebft th\u00fac v\u00e0 s\u1eafp \u0111\u00e1 theo tr\u1ea1ng th\u00e1i ho\u1eb7c theo b\u1ea3ng.">
      <MatchExplorer />
    </Shell>
  );
}
