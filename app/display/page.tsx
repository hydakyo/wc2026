import { MatchCard, MetricCard } from '@/components/Cards';
import { tournamentSummary } from '@/lib/worldcup-data';

export default function DisplayPage() {
  const summary = tournamentSummary();
  return (
    <main className="shell tv-shell">
      <div className="eyebrow">Màn hình TV / NOC</div>
      <h1>WorldCup Pulse Live</h1>
      <section className="metric-grid">
        <MetricCard label="Đang đá" value={summary.liveCount} hint="Trận hiện tại" />
        <MetricCard label="Bàn thắng" value={summary.goalsToday} hint="Tổng live" />
        <MetricCard label="Đi tiếp" value={summary.qualifiedCount} hint="Suất hiện tại" />
        <MetricCard label="Tiếp theo" value={summary.upcoming[0]?.home ?? 'TBD'} hint="Trận sắp đá" />
      </section>
      <section className="grid live-grid">
        {summary.live.map((match) => <MatchCard key={match.id} match={match} />)}
      </section>
    </main>
  );
}
