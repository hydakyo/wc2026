import { groupsForData, qualifiedTeamsForData, tableForData, thirdPlaceRankingForData, type TournamentData } from '@/lib/live-data';
import { teamLabel } from '@/lib/worldcup-data';
import { MiniStandingTable } from './Cards';

export function StandingsGrid({ data }: { data: TournamentData }) {
  const groups = groupsForData(data);
  if (!groups.length) return <div className="card"><p className="subtle">Chưa có bảng xếp hạng từ provider.</p></div>;
  return <section className="grid groups-grid">{groups.map((group) => <MiniStandingTable key={group} title={`Bảng ${group}`} rows={tableForData(data, group)} />)}</section>;
}

export function ThirdPlaceRace({ data }: { data: TournamentData }) {
  const rows = thirdPlaceRankingForData(data);
  return (
    <div className="card accent-card">
      <div className="section-title"><h2>Cuộc đua hạng ba</h2><span>Top 8 đi tiếp</span></div>
      {rows.length ? <table className="table">
        <thead><tr><th>Hạng</th><th>Đội</th><th>Bảng</th><th className="num">Điểm</th><th className="num">HS</th><th>Trạng thái</th></tr></thead>
        <tbody>{rows.map((row) => <tr key={row.team} className={row.rank <= 8 ? 'qualified-row' : 'danger-row'}><td>{row.rank}</td><td><b>{row.team}</b> {teamLabel(row.team, false)}</td><td>{row.group}</td><td className="num"><b>{row.points}</b></td><td className="num">{row.gd > 0 ? `+${row.gd}` : row.gd}</td><td>{row.rank <= 8 ? 'Vùng đi tiếp' : 'Nguy cơ bị loại'}</td></tr>)}</tbody>
      </table> : <p className="subtle">Chưa đủ dữ liệu để tính nhóm hạng ba.</p>}
    </div>
  );
}

export function QualifiedPanel({ data }: { data: TournamentData }) {
  const q = qualifiedTeamsForData(data);
  return (
    <div className="card">
      <div className="section-title"><h2>Tình hình đi tiếp</h2><span>Nhất bảng / nhì bảng / hạng ba tốt nhất</span></div>
      <div className="qual-grid">
        <div><h3>Đầu bảng</h3>{q.winners.map((t) => <p key={t.team}><b>{t.group}1</b> · {teamLabel(t.team)}</p>)}</div>
        <div><h3>Nhì bảng</h3>{q.runnersUp.map((t) => <p key={t.team}><b>{t.group}2</b> · {teamLabel(t.team)}</p>)}</div>
        <div><h3>Hạng ba tốt nhất</h3>{q.bestThird.map((t) => <p key={t.team}><b>#{t.rank}</b> · {teamLabel(t.team)}</p>)}</div>
      </div>
    </div>
  );
}
