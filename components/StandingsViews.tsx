import { groups, qualifiedTeams, tableFor, thirdPlaceRanking, teamLabel } from '@/lib/worldcup-data';
import { MiniStandingTable } from './Cards';

export function StandingsGrid() {
  return <section className="grid groups-grid">{groups.map((group) => <MiniStandingTable key={group} title={`Group ${group}`} rows={tableFor(group)} />)}</section>;
}

export function ThirdPlaceRace() {
  const rows = thirdPlaceRanking();
  return (
    <div className="card accent-card">
      <div className="section-title"><h2>Best Third-place Race</h2><span>Top 8 qualify</span></div>
      <table className="table">
        <thead><tr><th>Rank</th><th>Team</th><th>Group</th><th className="num">Pts</th><th className="num">GD</th><th>Status</th></tr></thead>
        <tbody>{rows.map((row) => <tr key={row.team} className={row.rank <= 8 ? 'qualified-row' : 'danger-row'}><td>{row.rank}</td><td><b>{row.team}</b> {teamLabel(row.team, false)}</td><td>{row.group}</td><td className="num"><b>{row.points}</b></td><td className="num">{row.gd > 0 ? `+${row.gd}` : row.gd}</td><td>{row.rank <= 8 ? 'Qualified zone' : 'At risk'}</td></tr>)}</tbody>
      </table>
    </div>
  );
}

export function QualifiedPanel() {
  const q = qualifiedTeams();
  return (
    <div className="card">
      <div className="section-title"><h2>Qualification Snapshot</h2><span>Winners / runners-up / best 3rd</span></div>
      <div className="qual-grid">
        <div><h3>Group winners</h3>{q.winners.map((t) => <p key={t.team}><b>{t.group}1</b> · {teamLabel(t.team)}</p>)}</div>
        <div><h3>Runners-up</h3>{q.runnersUp.map((t) => <p key={t.team}><b>{t.group}2</b> · {teamLabel(t.team)}</p>)}</div>
        <div><h3>Best third-place</h3>{q.bestThird.map((t) => <p key={t.team}><b>#{t.rank}</b> · {teamLabel(t.team)}</p>)}</div>
      </div>
    </div>
  );
}
