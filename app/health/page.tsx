import { Shell } from '@/components/Shell';
import { tournamentSummary } from '@/lib/worldcup-data';

export default function HealthPage() {
  const summary = tournamentSummary();
  return (
    <Shell title="Tr\u1ea1ng th\u00e1i d\u1eef li\u1ec7u" subtitle="Trang v\u1eadn h\u00e0nh cho \u0111\u1ed9 t\u01b0\u01a1i d\u1eef li\u1ec7u, tr\u1ea1ng th\u00e1i mock-provider v\u00e0 m\u1ee9c s\u1eb5n s\u00e0ng t\u00edch h\u1ee3p production.">
      <section className="metric-grid">
        <div className="card metric"><span>{'Ch\u1ebf \u0111\u1ed9 ngu\u1ed3n d\u1eef li\u1ec7u'}</span><strong>Mock</strong><em>{'S\u1eb5n s\u00e0ng thay b\u1eb1ng API th\u1eadt'}</em></div>
        <div className="card metric"><span>{'Tr\u1eadn \u0111ang \u0111\u00e1'}</span><strong>{summary.liveCount}</strong><em>{'S\u1eb5n s\u00e0ng polling ph\u00eda frontend'}</em></div>
        <div className="card metric"><span>{'Route'}</span><strong>8</strong><em>{'Dashboard + API'}</em></div>
        <div className="card metric"><span>{'M\u00fai gi\u1edd'}</span><strong>ICT</strong><em>Asia/Ho_Chi_Minh</em></div>
      </section>
      <div className="card"><div className="section-title"><h2>{'Checklist production'}</h2><span>{'Tr\u01b0\u1edbc khi public'}</span></div><p>{'C\u1ea7n t\u00edch h\u1ee3p provider adapter ph\u00eda server, th\u00eam cache, b\u1ea3o v\u1ec7 API key, c\u1ea3nh b\u00e1o d\u1eef li\u1ec7u c\u0169 v\u00e0 x\u00e1c th\u1ef1c tie-breaker ch\u00ednh th\u1ee9c qua ngu\u1ed3n d\u1eef li\u1ec7u.'}</p></div>
    </Shell>
  );
}
