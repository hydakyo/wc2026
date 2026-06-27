import { tournamentSummary, teamName } from '@/lib/worldcup-data';

export default function DisplayPage() {
  const summary = tournamentSummary();
  return (
    <main className="page tv">
      <div className="eyebrow">TV / NOC Display</div>
      <h1>WorldCup Pulse Live</h1>
      <section className="grid kpis">
        <div className="card"><div className="card-title">Live</div><div className="kpi-value">{summary.liveCount}</div></div>
        <div className="card"><div className="card-title">Goals</div><div className="kpi-value">{summary.goalsToday}</div></div>
        <div className="card"><div className="card-title">Qualified</div><div className="kpi-value">{summary.qualifiedCount}</div></div>
      </section>
      <section className="grid dashboard">
        {summary.live.map((match) => (
          <div className="card match" key={match.id}>
            <div className="match-head"><span>{match.stage} / Group {match.group}</span><span className="status live">LIVE {match.minute}'</span></div>
            <div className="score-row"><div className="team"><span className="code">{match.home}</span>{teamName(match.home)}</div><div className="score">{match.homeScore}</div></div>
            <div className="score-row"><div className="team"><span className="code">{match.away}</span>{teamName(match.away)}</div><div className="score">{match.awayScore}</div></div>
            <div className="subtle">{match.venue}</div>
          </div>
        ))}
      </section>
    </main>
  );
}
