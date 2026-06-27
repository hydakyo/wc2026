import { AnalyticsViews } from '@/components/AnalyticsViews';
import { MatchCard, MetricCard } from '@/components/Cards';
import { QualifiedPanel, StandingsGrid, ThirdPlaceRace } from '@/components/StandingsViews';
import { BracketView } from '@/components/BracketView';
import { Shell } from '@/components/Shell';
import { formatKickoff, tournamentSummary } from '@/lib/worldcup-data';

export default function Home() {
  const summary = tournamentSummary();
  return (
    <Shell title="WorldCup Pulse" subtitle="Premium realtime-style tournament command center for World Cup 2026: live matches, qualification race, groups, bracket and analytics.">
      <section className="metric-grid">
        <MetricCard label="Live matches" value={summary.liveCount} hint="Auto-refresh ready" />
        <MetricCard label="Live goals" value={summary.goalsToday} hint="Current live total" />
        <MetricCard label="Qualified slots" value={summary.qualifiedCount} hint="Top 2 + best 3rd" />
        <MetricCard label="Next kickoff" value={summary.nextKickoff ? formatKickoff(summary.nextKickoff) : 'TBD'} hint="ICT timezone" />
      </section>

      <section className="command-grid">
        <div className="card command-primary">
          <div className="section-title"><h2>Live Match Center</h2><span>{summary.live.length} live</span></div>
          <div className="grid live-grid">{summary.live.map((match) => <MatchCard key={match.id} match={match} />)}</div>
        </div>
        <div className="stack">
          <div className="card"><div className="section-title"><h2>Latest Results</h2><a href="/matches">View all</a></div>{summary.finished.map((match) => <MatchCard key={match.id} match={match} dense />)}</div>
          <div className="card"><div className="section-title"><h2>Upcoming</h2><a href="/matches">Schedule</a></div>{summary.upcoming.slice(0, 3).map((match) => <MatchCard key={match.id} match={match} dense />)}</div>
        </div>
      </section>

      <section className="grid two-col"><QualifiedPanel /><ThirdPlaceRace /></section>
      <AnalyticsViews />
      <section className="card"><div className="section-title"><h2>Projected Bracket</h2><a href="/bracket">Open bracket</a></div><BracketView /></section>
      <StandingsGrid />
    </Shell>
  );
}
