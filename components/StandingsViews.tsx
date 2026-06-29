import { groups, qualifiedTeams, tableFor, thirdPlaceRanking, teamLabel } from '@/lib/worldcup-data';
import { MiniStandingTable } from './Cards';

export function StandingsGrid() {
  return <section className="grid groups-grid">{groups.map((group) => <MiniStandingTable key={group} title={`B\u1ea3ng ${group}`} rows={tableFor(group)} />)}</section>;
}

export function ThirdPlaceRace() {
  const rows = thirdPlaceRanking();
  return (
    <div className="card accent-card">
      <div className="section-title"><h2>{'Cu\u1ed9c \u0111ua h\u1ea1ng ba'}</h2><span>{'Top 8 \u0111i ti\u1ebfp'}</span></div>
      <table className="table">
        <thead><tr><th>{'H\u1ea1ng'}</th><th>{'\u0110\u1ed9i'}</th><th>{'B\u1ea3ng'}</th><th className="num">{'\u0110i\u1ec3m'}</th><th className="num">{'HS'}</th><th>{'Tr\u1ea1ng th\u00e1i'}</th></tr></thead>
        <tbody>{rows.map((row) => <tr key={row.team} className={row.rank <= 8 ? 'qualified-row' : 'danger-row'}><td>{row.rank}</td><td><b>{row.team}</b> {teamLabel(row.team, false)}</td><td>{row.group}</td><td className="num"><b>{row.points}</b></td><td className="num">{row.gd > 0 ? `+${row.gd}` : row.gd}</td><td>{row.rank <= 8 ? 'V\u00f9ng \u0111i ti\u1ebfp' : 'Nguy c\u01a1 b\u1ecb lo\u1ea1i'}</td></tr>)}</tbody>
      </table>
    </div>
  );
}

export function QualifiedPanel() {
  const q = qualifiedTeams();
  return (
    <div className="card">
      <div className="section-title"><h2>{'T\u00ecnh h\u00ecnh \u0111i ti\u1ebfp'}</h2><span>{'Nh\u1ea5t b\u1ea3ng / nh\u00ec b\u1ea3ng / h\u1ea1ng ba t\u1ed1t nh\u1ea5t'}</span></div>
      <div className="qual-grid">
        <div><h3>{'\u0110\u1ea7u b\u1ea3ng'}</h3>{q.winners.map((t) => <p key={t.team}><b>{t.group}1</b> · {teamLabel(t.team)}</p>)}</div>
        <div><h3>{'Nh\u00ec b\u1ea3ng'}</h3>{q.runnersUp.map((t) => <p key={t.team}><b>{t.group}2</b> · {teamLabel(t.team)}</p>)}</div>
        <div><h3>{'H\u1ea1ng ba t\u1ed1t nh\u1ea5t'}</h3>{q.bestThird.map((t) => <p key={t.team}><b>#{t.rank}</b> · {teamLabel(t.team)}</p>)}</div>
      </div>
    </div>
  );
}
