import { MatchCard, MetricCard } from '@/components/Cards';
import { tournamentSummary } from '@/lib/worldcup-data';

export default function DisplayPage() {
  const summary = tournamentSummary();
  return (
    <main className="shell tv-shell">
      <div className="eyebrow">TV / NOC Display</div>
      <h1>WorldCup Pulse Live</h1>
      <section className="metric-grid">
        <MetricCard label="Live" value={summary.liveCount} hint="Matches now" />
        <MetricCard label="Goals" value={summary.goalsToday} hint="Live total" />
        <MetricCard label="Qualified" value={summary.qualifiedCount} hint="Current slots" />
        <MetricCard label="Next" value={summary.upcoming[0]?.home ?? 'TBD'} hint="Upcoming kickoff" />
      </section>
      <section className="grid live-grid">
        {summary.live.map((match) => <MatchCard key={match.id} match={match} />)}
      </section>
    </main>
  );
}
