import { MatchCard, MetricCard } from '@/components/Cards';
import { DataSourceBanner } from '@/components/DataSourceBanner';
import { QualifiedPanel, ThirdPlaceRace } from '@/components/StandingsViews';
import { Shell } from '@/components/Shell';
import { getProductionTournamentData, tournamentSummaryForData } from '@/lib/production-data';
import { formatKickoff } from '@/lib/worldcup-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const data = await getProductionTournamentData();
  const summary = tournamentSummaryForData(data);
  const spotlight = summary.live[0] ?? summary.upcoming[0] ?? summary.finished[0];
  const hasRealContent = data.matches.length > 0;

  return (
    <Shell title="WorldCup Pulse" subtitle="Trung tâm World Cup 2026 bằng tiếng Việt: lịch thi đấu, tỷ số, trạng thái trận và bức tranh đi tiếp trong một giao diện gọn, rõ, realtime-ready.">
      <DataSourceBanner source={data.source} />

      <section className="home-hero">
        <div className="home-hero-copy">
          <span className="live-dot">WORLD CUP 2026 LIVE HUB</span>
          <h2>Lịch thi đấu, tỷ số và trạng thái giải đấu trong một màn hình sạch.</h2>
          <p>Ưu tiên dữ liệu thật từ provider công khai, không hiển thị mock như dữ liệu chính thức. Khi provider lỗi, trạng thái nguồn sẽ được báo rõ.</p>
          <div className="hero-actions"><a href="/matches">Xem lịch & tỷ số</a><a href="/standings">Xem bảng xếp hạng</a></div>
        </div>
        <div className="spotlight-card">
          <div className="section-title"><h2>Trận nổi bật</h2><span>{spotlight ? 'Đang theo dõi' : 'Chờ dữ liệu'}</span></div>
          {spotlight ? <MatchCard match={spotlight} /> : <p className="empty-copy">Provider chưa trả về trận trong cửa sổ hiện tại.</p>}
        </div>
      </section>

      <section className="metric-grid compact">
        <MetricCard label="Trận live" value={summary.liveCount} hint="Đang diễn ra" />
        <MetricCard label="Tổng trận" value={data.matches.length} hint="Trong cửa sổ provider" />
        <MetricCard label="Suất đi tiếp" value={summary.qualifiedCount} hint="Tính từ standings hiện có" />
        <MetricCard label="Trận kế tiếp" value={summary.nextKickoff ? formatKickoff(summary.nextKickoff) : 'Chưa có'} hint="Giờ Việt Nam" />
      </section>

      {!hasRealContent ? (
        <section className="card empty-state">
          <h2>Chưa có dữ liệu trận đấu từ provider</h2>
          <p>Website vẫn hoạt động, nhưng không dựng dữ liệu giả làm dữ liệu thật. Kiểm tra lại endpoint/provider hoặc chờ khi provider mở dữ liệu cho ngày thi đấu.</p>
        </section>
      ) : null}

      <section className="home-grid">
        <div className="home-main">
          <div className="card">
            <div className="section-title"><h2>Trận đang diễn ra</h2><a href="/matches">Tất cả trận</a></div>
            {summary.live.length ? <div className="stack-list">{summary.live.slice(0, 4).map((match) => <MatchCard key={match.id} match={match} />)}</div> : <p className="empty-copy">Hiện không có trận live.</p>}
          </div>

          <div className="card">
            <div className="section-title"><h2>Sắp thi đấu</h2><a href="/matches">Lịch đầy đủ</a></div>
            {summary.upcoming.length ? <div className="stack-list">{summary.upcoming.slice(0, 5).map((match) => <MatchCard key={match.id} match={match} dense />)}</div> : <p className="empty-copy">Chưa có trận sắp đá trong cửa sổ provider.</p>}
          </div>
        </div>

        <aside className="home-side">
          <div className="card">
            <div className="section-title"><h2>Kết quả gần nhất</h2><a href="/matches">Xem thêm</a></div>
            {summary.finished.length ? <div className="stack-list">{summary.finished.slice(0, 4).map((match) => <MatchCard key={match.id} match={match} dense />)}</div> : <p className="empty-copy">Chưa có kết quả mới.</p>}
          </div>
        </aside>
      </section>

      <section className="grid two-col production-summary">
        <QualifiedPanel data={data} />
        <ThirdPlaceRace data={data} />
      </section>
    </Shell>
  );
}
