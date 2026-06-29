import { MatchCard, MetricCard } from '@/components/Cards';
import { tournamentSummary } from '@/lib/worldcup-data';

export default function DisplayPage() {
  const summary = tournamentSummary();
  return (
    <main className="shell tv-shell">
      <div className="eyebrow">M\u00e0n h\u00ecnh TV / NOC</div>
      <h1>WorldCup Pulse Live</h1>
      <section className="metric-grid">
        <MetricCard label="\u0110ang \u0111\u00e1" value={summary.liveCount} hint="Tr\u1eadn hi\u1ec7n t\u1ea1i" />
        <MetricCard label="B\u00e0n th\u1eafng" value={summary.goalsToday} hint="T\u1ed5ng live" />
        <MetricCard label="\u0110i ti\u1ebfp" value={summary.qualifiedCount} hint="Su\u1ea5t hi\u1ec7n t\u1ea1i" />
        <MetricCard label="Ti\u1ebfp theo" value={summary.upcoming[0]?.home ?? 'TBD'} hint="Tr\u1eadn s\u1eafp \u0111\u00e1" />
      </section>
      <section className="grid live-grid">
        {summary.live.map((match) => <MatchCard key={match.id} match={match} />)}
      </section>
    </main>
  );
}
