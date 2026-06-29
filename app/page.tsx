import { AnalyticsViews } from '@/components/AnalyticsViews';
import { MatchCard, MetricCard } from '@/components/Cards';
import { QualifiedPanel, StandingsGrid, ThirdPlaceRace } from '@/components/StandingsViews';
import { BracketView } from '@/components/BracketView';
import { Shell } from '@/components/Shell';
import { formatKickoff, tournamentSummary } from '@/lib/worldcup-data';

export default function Home() {
  const summary = tournamentSummary();
  return (
    <Shell title="WorldCup Pulse" subtitle="B\u1ea3ng \u0111i\u1ec1u khi\u1ec3n gi\u1ea3i \u0111\u1ea5u World Cup 2026: tr\u1eadn \u0111ang \u0111\u00e1, cu\u1ed9c \u0111ua \u0111i ti\u1ebfp, b\u1ea3ng \u0111\u1ea5u, nh\u00e1nh \u0111\u1ea5u v\u00e0 th\u1ed1ng k\u00ea.">
      <section className="metric-grid">
        <MetricCard label="Tr\u1eadn \u0111ang \u0111\u00e1" value={summary.liveCount} hint="S\u1eb5n s\u00e0ng t\u1ef1 \u0111\u1ed9ng c\u1eadp nh\u1eadt" />
        <MetricCard label="B\u00e0n th\u1eafng live" value={summary.goalsToday} hint="T\u1ed5ng trong c\u00e1c tr\u1eadn live" />
        <MetricCard label="Su\u1ea5t \u0111i ti\u1ebfp" value={summary.qualifiedCount} hint="Top 2 + h\u1ea1ng ba t\u1ed1t nh\u1ea5t" />
        <MetricCard label="Tr\u1eadn k\u1ebf ti\u1ebfp" value={summary.nextKickoff ? formatKickoff(summary.nextKickoff) : 'Ch\u01b0a x\u00e1c \u0111\u1ecbnh'} hint="Gi\u1edd Vi\u1ec7t Nam" />
      </section>

      <section className="command-grid">
        <div className="card command-primary">
          <div className="section-title"><h2>{'Trung t\u00e2m tr\u1eadn \u0111ang \u0111\u00e1'}</h2><span>{summary.live.length} {'tr\u1eadn live'}</span></div>
          <div className="grid live-grid">{summary.live.map((match) => <MatchCard key={match.id} match={match} />)}</div>
        </div>
        <div className="stack">
          <div className="card"><div className="section-title"><h2>{'K\u1ebft qu\u1ea3 g\u1ea7n nh\u1ea5t'}</h2><a href="/matches">{'Xem t\u1ea5t c\u1ea3'}</a></div>{summary.finished.map((match) => <MatchCard key={match.id} match={match} dense />)}</div>
          <div className="card"><div className="section-title"><h2>{'Tr\u1eadn s\u1eafp \u0111\u00e1'}</h2><a href="/matches">{'L\u1ecbch thi \u0111\u1ea5u'}</a></div>{summary.upcoming.slice(0, 3).map((match) => <MatchCard key={match.id} match={match} dense />)}</div>
        </div>
      </section>

      <section className="grid two-col"><QualifiedPanel /><ThirdPlaceRace /></section>
      <AnalyticsViews />
      <section className="card"><div className="section-title"><h2>{'Nh\u00e1nh \u0111\u1ea5u d\u1ef1 ki\u1ebfn'}</h2><a href="/bracket">{'M\u1edf nh\u00e1nh \u0111\u1ea5u'}</a></div><BracketView /></section>
      <StandingsGrid />
    </Shell>
  );
}
