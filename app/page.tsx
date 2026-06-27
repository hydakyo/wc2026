import { bracket, groups, qualifiedTeams, tableFor, teamName, thirdPlaceRanking, tournamentSummary } from '@/lib/worldcup-data';

function Status({ status }: { status: string }) {
  const className = status === 'LIVE' ? 'status live' : status === 'FT' ? 'status ft' : 'status scheduled';
  return <span className={className}>{status}</span>;
}

function MatchCard({ match }: { match: ReturnType<typeof tournamentSummary>['live'][number] }) {
  return (
    <div className="match">
      <div className="match-head">
        <span>{match.stage}{match.group ? ` / Group ${match.group}` : ''}</span>
        <Status status={match.status} />
      </div>
      <div className="score-row"><div className="team"><span className="code">{match.home}</span>{teamName(match.home)}</div><div className="score">{match.homeScore ?? '-'}</div></div>
      <div className="score-row"><div className="team"><span className="code">{match.away}</span>{teamName(match.away)}</div><div className="score">{match.awayScore ?? '-'}</div></div>
      <div className="subtle">{match.minute ? `${match.minute}'` : ''} · {match.venue}</div>
      {match.events?.length ? <div className="events">{match.events.map((event) => <span key={event}>{event}</span>)}</div> : null}
    </div>
  );
}

function StandingsTable({ group }: { group: string }) {
  return (
    <div className="card">
      <h3 className="card-title">Group {group}</h3>
      <table className="table">
        <thead><tr><th>#</th><th>Team</th><th className="num">P</th><th className="num">GD</th><th className="num">Pts</th><th>Form</th></tr></thead>
        <tbody>
          {tableFor(group).map((row, index) => <tr key={row.team} className={`rank-${index + 1}`}><td>{index + 1}</td><td><b>{row.team}</b> {teamName(row.team)}</td><td className="num">{row.played}</td><td className="num">{row.gd > 0 ? `+${row.gd}` : row.gd}</td><td className="num"><b>{row.points}</b></td><td>{row.form}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}

export default function Home() {
  const summary = tournamentSummary();
  const qualified = qualifiedTeams();
  const thirds = thirdPlaceRanking();

  return (
    <main className="page">
      <header className="header">
        <div>
          <div className="eyebrow">World Cup 2026 · Realtime Command Center</div>
          <h1>WorldCup Pulse</h1>
          <div className="subtle">Live score, standings, top third-place race, bracket and team analytics in one high-visibility dashboard.</div>
        </div>
        <nav className="nav"><a href="/display">TV Mode</a><a href="/api/worldcup/summary">API Summary</a><span className="pill">Last sync: realtime mock</span></nav>
      </header>

      <section className="grid kpis">
        <div className="card"><div className="card-title">Live matches</div><div className="kpi-value">{summary.liveCount}</div></div>
        <div className="card"><div className="card-title">Goals live</div><div className="kpi-value">{summary.goalsToday}</div></div>
        <div className="card"><div className="card-title">Qualified slots</div><div className="kpi-value">{summary.qualifiedCount}</div></div>
        <div className="card"><div className="card-title">Groups</div><div className="kpi-value">12</div></div>
        <div className="card"><div className="card-title">Best 3rd places</div><div className="kpi-value">8</div></div>
      </section>

      <section className="grid dashboard">
        <div className="card">
          <h2 className="card-title">Live Match Center</h2>
          <div className="live-stack">{summary.live.map((match) => <MatchCard key={match.id} match={match} />)}</div>
        </div>
        <div className="grid">
          <div className="card"><h2 className="card-title">Latest Results</h2>{summary.finished.map((m) => <p key={m.id}><b>{m.home}</b> {m.homeScore}-{m.awayScore} <b>{m.away}</b> · {m.stage}</p>)}</div>
          <div className="card"><h2 className="card-title">Upcoming</h2>{summary.upcoming.map((m) => <p key={m.id}><b>{m.home}</b> vs <b>{m.away}</b> · {m.stage} · {m.venue}</p>)}</div>
        </div>
      </section>

      <section className="grid two-col" style={{ marginTop: 16 }}>
        <div className="card"><h2 className="card-title">Qualified Teams</h2><p><b>Group winners:</b> {qualified.winners.map((t) => t.team).join(', ')}</p><p><b>Runners-up:</b> {qualified.runnersUp.map((t) => t.team).join(', ')}</p><p><b>Best third-place:</b> {qualified.bestThird.map((t) => t.team).join(', ')}</p></div>
        <div className="card"><h2 className="card-title">Top 8 Third-place Race</h2><table className="table"><tbody>{thirds.map((t) => <tr key={t.team} className={t.rank <= 8 ? 'rank-2' : ''}><td>{t.rank}</td><td><b>{t.team}</b> {teamName(t.team)}</td><td className="num">{t.points} pts</td><td className="num">{t.gd > 0 ? `+${t.gd}` : t.gd}</td><td>{t.status}</td></tr>)}</tbody></table></div>
      </section>

      <section className="grid groups">{groups.map((group) => <StandingsTable key={group} group={group} />)}</section>

      <section className="card" style={{ marginTop: 16 }}><h2 className="card-title">Projected Knockout Bracket</h2><div className="bracket">{bracket.map((node, index) => <div className="bracket-node" key={`${node.round}-${index}`}><div className="subtle">{node.round}</div><h3>{node.left} vs {node.right}</h3><span className="pill">{node.status}</span></div>)}</div></section>

      <section className="grid analytics">
        <div className="card"><h2 className="card-title">Top Attack</h2>{summary.topAttack.map((t) => <p key={t.team}><b>{t.team}</b> · {t.gf} goals</p>)}</div>
        <div className="card"><h2 className="card-title">Best Defense</h2>{summary.bestDefense.map((t) => <p key={t.team}><b>{t.team}</b> · {t.ga} conceded</p>)}</div>
        <div className="card"><h2 className="card-title">Visibility Rules</h2><p>Large score typography, tabular numbers, live pulse, qualified colors, stale-data ready API layer.</p></div>
      </section>
    </main>
  );
}
