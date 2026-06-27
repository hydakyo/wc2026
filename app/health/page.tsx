import { Shell } from '@/components/Shell';
import { tournamentSummary } from '@/lib/worldcup-data';

export default function HealthPage() {
  const summary = tournamentSummary();
  return (
    <Shell title="Data Health" subtitle="Operational status page for data freshness, mock-provider state and production integration readiness.">
      <section className="metric-grid">
        <div className="card metric"><span>Provider mode</span><strong>Mock</strong><em>Ready for API adapter</em></div>
        <div className="card metric"><span>Live matches</span><strong>{summary.liveCount}</strong><em>Frontend polling ready</em></div>
        <div className="card metric"><span>Routes</span><strong>8</strong><em>Dashboard + API</em></div>
        <div className="card metric"><span>Timezone</span><strong>ICT</strong><em>Asia/Ho_Chi_Minh</em></div>
      </section>
      <div className="card"><div className="section-title"><h2>Production checklist</h2><span>Before public launch</span></div><p>Implement server-side provider adapter, add cache, protect API keys, enable stale-data warning and validate official tie-breakers through the data source.</p></div>
    </Shell>
  );
}
