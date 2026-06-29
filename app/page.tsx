import { MatchCard } from '@/components/Cards';
import { DataSourceBanner } from '@/components/DataSourceBanner';
import { QualifiedPanel, ThirdPlaceRace } from '@/components/StandingsViews';
import { Shell } from '@/components/Shell';
import { groupsForData } from '@/lib/live-data';
import { getProductionTournamentData, tournamentSummaryForData } from '@/lib/production-data';
import { teamLabel } from '@/lib/worldcup-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const data = await getProductionTournamentData();
  const summary = tournamentSummaryForData(data);
  const groups = groupsForData(data);
  const hasRealContent = data.matches.length > 0;

  return (
    <Shell title="World Cup 2026" subtitle="Lịch thi đấu, tỷ số, bảng xếp hạng và tình hình đi tiếp theo giờ Việt Nam.">
      <DataSourceBanner source={data.source} />

      {!hasRealContent ? (
        <section className="card empty-state">
          <h2>Chưa có dữ liệu trận đấu từ provider</h2>
          <p>Website vẫn hoạt động, nhưng không dựng dữ liệu giả làm dữ liệu thật. Kiểm tra lại endpoint/provider hoặc chờ khi provider mở dữ liệu cho ngày thi đấu.</p>
        </section>
      ) : null}

      <section className="dashboard-layout">
        <div className="dashboard-main">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Tất cả trận đấu</p>
              <h2>Tổng quan trận đấu</h2>
            </div>
            <a className="text-link" href="/matches">Xem đầy đủ</a>
          </div>

          <section className="panel-block">
            <div className="section-title"><h2>Đang diễn ra</h2><span>{summary.live.length} trận</span></div>
            {summary.live.length ? <div className="stack-list">{summary.live.slice(0, 4).map((match) => <MatchCard key={match.id} match={match} />)}</div> : <div className="empty-panel">Chưa có trận đang diễn ra.</div>}
          </section>

          <section className="panel-block">
            <div className="section-title"><h2>Sắp diễn ra</h2><span>{summary.upcoming.length} trận gần nhất</span></div>
            {summary.upcoming.length ? <div className="stack-list">{summary.upcoming.slice(0, 5).map((match) => <MatchCard key={match.id} match={match} dense />)}</div> : <div className="empty-panel">Chưa có trận sắp diễn ra trong cửa sổ provider.</div>}
          </section>

          <section className="panel-block">
            <div className="section-title"><h2>Kết quả gần nhất</h2><span>{summary.finished.length} trận</span></div>
            {summary.finished.length ? <div className="stack-list">{summary.finished.slice(0, 4).map((match) => <MatchCard key={match.id} match={match} dense />)}</div> : <div className="empty-panel">Chưa có kết quả mới.</div>}
          </section>
        </div>

        <aside className="dashboard-side">
          <div className="card group-panel">
            <div className="section-title"><h2>Bảng đấu</h2><span>{groups.length} bảng</span></div>
            <div className="group-filter-grid link-grid">
              <a className="active" href="/matches">Tất cả</a>
              {groups.map((group) => <a href="/standings" key={group}>Bảng {group}</a>)}
            </div>
          </div>

          <div className="card stat-panel">
            <div className="section-title"><h2>Số liệu thống kê</h2><span>Theo bảng xếp hạng</span></div>
            <table className="table stats-table">
              <thead><tr><th>#</th><th>Đội</th><th className="num">Bàn thắng</th></tr></thead>
              <tbody>
                {summary.topAttack.slice(0, 5).map((row, index) => (
                  <tr key={row.team}><td>{index + 1}</td><td><b>{teamLabel(row.team, false)}</b></td><td className="num"><b>{row.gf}</b></td></tr>
                ))}
              </tbody>
            </table>
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
