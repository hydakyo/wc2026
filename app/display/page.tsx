import { MatchCard, MetricCard } from '@/components/Cards';
import { DataSourceBanner } from '@/components/DataSourceBanner';
import { getProductionTournamentData, tournamentSummaryForData } from '@/lib/production-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DisplayPage() {
  const data = await getProductionTournamentData();
  const summary = tournamentSummaryForData(data);
  const displayMatches = summary.live.length ? summary.live : summary.upcoming.slice(0, 4);
  return (
    <main className="shell tv-shell">
      <DataSourceBanner source={data.source} />
      <div className="eyebrow">Màn hình TV / NOC</div>
      <h1>WorldCup Pulse Live</h1>
      <section className="metric-grid">
        <MetricCard label="Đang đá" value={summary.liveCount} hint="Trận hiện tại" />
        <MetricCard label="Tổng trận" value={data.matches.length} hint="Cửa sổ provider" />
        <MetricCard label="Đi tiếp" value={summary.qualifiedCount} hint="Suất hiện tại" />
        <MetricCard label="Tiếp theo" value={summary.upcoming[0]?.home ?? 'TBD'} hint="Trận sắp đá" />
      </section>
      <section className="grid live-grid">
        {displayMatches.length ? displayMatches.map((match) => <MatchCard key={match.id} match={match} />) : <div className="card"><p className="empty-copy">Chưa có dữ liệu trận từ provider.</p></div>}
      </section>
    </main>
  );
}
