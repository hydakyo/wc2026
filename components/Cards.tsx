import { formatKickoff, teamLabel } from '@/lib/worldcup-data';
import type { Match, StandingRow } from '@/lib/worldcup-data';

export function MetricCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return <div className="card metric"><span>{label}</span><strong>{value}</strong>{hint ? <em>{hint}</em> : null}</div>;
}

export function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase().replace(/\s+/g, '-');
  return <span className={`status ${key}`}>{status}</span>;
}

export function MatchCard({ match, dense = false }: { match: Match; dense?: boolean }) {
  return (
    <article className={`match-card ${dense ? 'dense' : ''}`}>
      <div className="match-meta"><span>{match.stage}{match.group ? ` · Group ${match.group}` : ''}</span><StatusBadge status={match.status} /></div>
      <div className="team-line"><span>{teamLabel(match.home)}</span><b>{match.homeScore ?? '-'}</b></div>
      <div className="team-line"><span>{teamLabel(match.away)}</span><b>{match.awayScore ?? '-'}</b></div>
      <div className="match-foot"><span>{match.minute ? `${match.minute}'` : formatKickoff(match.kickoff)}</span><span>{match.venue}</span></div>
      {!dense && match.events?.length ? <div className="timeline">{match.events.map((event) => <span key={event}>{event}</span>)}</div> : null}
    </article>
  );
}

export function MiniStandingTable({ title, rows }: { title: string; rows: StandingRow[] }) {
  return (
    <div className="card">
      <div className="section-title"><h2>{title}</h2><span>{rows.length} teams</span></div>
      <table className="table">
        <thead><tr><th>#</th><th>Team</th><th className="num">P</th><th className="num">GD</th><th className="num">Pts</th><th>Form</th></tr></thead>
        <tbody>{rows.map((row, index) => <tr key={`${row.group}-${row.team}`} className={index < 2 ? 'qualified-row' : index === 2 ? 'bubble-row' : ''}><td>{index + 1}</td><td><b>{row.team}</b> {teamLabel(row.team, false)}</td><td className="num">{row.played}</td><td className="num">{row.gd > 0 ? `+${row.gd}` : row.gd}</td><td className="num"><b>{row.points}</b></td><td>{row.form}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
