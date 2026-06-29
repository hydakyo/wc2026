import { AnalyticsViews } from '@/components/AnalyticsViews';
import { MatchCard, MetricCard } from '@/components/Cards';
import { DataSourceBanner } from '@/components/DataSourceBanner';
import { QualifiedPanel, StandingsGrid, ThirdPlaceRace } from '@/components/StandingsViews';
import { BracketView } from '@/components/BracketView';
import { Shell } from '@/components/Shell';
import { getTournamentData, tournamentSummaryForData } from '@/lib/live-data';
import { formatKickoff } from '@/lib/worldcup-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const data = await getTournamentData();
  const summary = tournamentSummaryForData(data);
  const featuredMatch = summary.live[0] ?? summary.upcoming[0] ?? summary.finished[0];
  return (
    <Shell title="WorldCup Pulse" subtitle="Trung tâm theo dõi World Cup 2026 bằng tiếng Việt: lịch thi đấu, tỷ số, bảng xếp hạng, suất đi tiếp và nhánh knock-out.">
      <DataSourceBanner source={data.source} />
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="live-dot">LIVE CENTER</span>
          <h2>Theo dõi toàn bộ giải đấu trong một màn hình</h2>
          <p>Dữ liệu được tải từ provider bóng đá ở phía server. Trang tự làm mới mỗi 30 giây.</p>
          <div className="hero-actions"><a href="/matches">Xem trận đấu</a><a href="/standings">Bảng xếp hạng</a></div>
        </div>
        {featuredMatch ? <MatchCard match={featuredMatch} /> : <div className="card"><p className="subtle">Chưa có trận từ provider.</p></div>}
      </section>

      <section className="metric-grid">
        <MetricCard label="Đang đá" value={summary.liveCount} hint="Trận live hiện tại" />
        <MetricCard label="Bàn thắng live" value={summary.goalsToday} hint="Tổng trong các trận đang đá" />
        <MetricCard label="Suất đi tiếp" value={summary.qualifiedCount} hint="Top 2 + hạng ba tốt nhất" />
        <MetricCard label="Trận kế tiếp" value={summary.nextKickoff ? formatKickoff(summary.nextKickoff) : 'Chưa xác định'} hint="Giờ Việt Nam" />
      </section>

      <section className="content-grid">
        <div className="main-column">
          <div className="card">
            <div className="section-title"><h2>Trận đang diễn ra</h2><span>{summary.live.length} trận</span></div>
            {summary.live.length ? <div className="grid live-grid">{summary.live.map((match) => <MatchCard key={match.id} match={match} />)}</div> : <p className="subtle">Hiện không có trận live từ provider.</p>}
          </div>
          <section className="grid two-col"><QualifiedPanel data={data} /><ThirdPlaceRace data={data} /></section>
        </div>

        <aside className="side-column">
          <div className="card"><div className="section-title"><h2>Kết quả gần nhất</h2><a href="/matches">Tất cả</a></div>{summary.finished.slice(0, 4).map((match) => <MatchCard key={match.id} match={match} dense />)}</div>
          <div className="card"><div className="section-title"><h2>Sắp thi đấu</h2><a href="/matches">Lịch</a></div>{summary.upcoming.slice(0, 4).map((match) => <MatchCard key={match.id} match={match} dense />)}</div>
        </aside>
      </section>

      <AnalyticsViews data={data} />
      <section className="card bracket-card"><div className="section-title"><h2>Nhánh đấu</h2><a href="/bracket">Mở chi tiết</a></div><BracketView data={data} /></section>
      <StandingsGrid data={data} />
    </Shell>
  );
}
