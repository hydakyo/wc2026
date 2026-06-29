import { MatchCard, MetricCard } from '@/components/Cards';
import { DataSourceBanner } from '@/components/DataSourceBanner';
import { getTournamentData, tournamentSummaryForData } from '@/lib/live-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DisplayPage() {
  const data = await getTournamentData();
  const summary = tournamentSummaryForData(data);
  return (
    <main className="shell tv-shell">
      <DataSourceBanner source={data.source} />
      <div className="eyebrow">Màn hình TV / NOC</div>
      <h1>WorldCup Pulse Live</h1>
      <section className="metric-grid">
        <MetricCard label="Đang đá" value={summary.liveCount} hint="Trận hiện tại" />
        <MetricCard label="Bàn thắng" value={summary.goalsToday} hint="Tổng live" />
        <MetricCard label="Đi tiếp" value={summary.qualifiedCount} hint="Suất hiện tại" />
        <MetricCard label="Tiếp theo" value={summary.upcoming[0]?.home ?? 'TBD'} hint="Trận sắp đá" />
      </section>
      <section className="grid live-grid">
        {(summary.live.length ? summary.live : summary.upcoming.slice(0, 4)).map((match) => <MatchCard key={match.id} match={match} />)}
      </section>
    </main>
  );
}
