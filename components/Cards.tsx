import { formatKickoff, stageLabel, statusLabel, teamLabel } from '@/lib/worldcup-data';
import type { Match, StandingRow } from '@/lib/worldcup-data';

export function MetricCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {hint ? <em>{hint}</em> : null}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase().replace(/\s+/g, '-');
  return <span className={`status ${key}`}>{statusLabel(status)}</span>;
}

export function MatchCard({ match, dense = false }: { match: Match; dense?: boolean }) {
  return (
    <article className={`match-card ${dense ? 'dense' : ''}`}>
      <div className="match-meta">
        <span>{stageLabel(match.stage)}{match.group ? ` · Bảng ${match.group}` : ''}</span>
        <StatusBadge status={match.status} />
      </div>

      <div className="scoreboard">
        <div className="team-side">
          <span>{teamLabel(match.home)}</span>
          <strong>{match.homeScore ?? '-'}</strong>
        </div>
        <div className="versus">VS</div>
        <div className="team-side right">
          <span>{teamLabel(match.away)}</span>
          <strong>{match.awayScore ?? '-'}</strong>
        </div>
      </div>

      <div className="match-foot"><span>{match.minute ? `${match.minute}'` : formatKickoff(match.kickoff)}</span><span>{match.venue}</span></div>
      {!dense && match.events?.length ? <div className="timeline">{match.events.map((event) => <span key={event}>{event}</span>)}</div> : null}
    </article>
  );
}

export function MiniStandingTable({ title, rows }: { title: string; rows: StandingRow[] }) {
  return (
    <div className="card table-card">
      <div className="section-title"><h2>{title}</h2><span>{rows.length} đội</span></div>
      <table className="table compact-table">
        <thead><tr><th>#</th><th>Đội</th><th className="num">Tr</th><th className="num">HS</th><th className="num">Điểm</th><th>Phong độ</th></tr></thead>
        <tbody>{rows.map((row, index) => <tr key={`${row.group}-${row.team}`} className={index < 2 ? 'qualified-row' : index === 2 ? 'bubble-row' : ''}><td>{index + 1}</td><td><b>{row.team}</b> {teamLabel(row.team, false)}</td><td className="num">{row.played}</td><td className="num">{row.gd > 0 ? `+${row.gd}` : row.gd}</td><td className="num"><b>{row.points}</b></td><td>{row.form}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
