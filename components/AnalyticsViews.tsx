import { analytics, teamLabel } from '@/lib/worldcup-data';

export function AnalyticsViews() {
  const data = analytics();
  return (
    <section className="grid analytics-grid">
      <div className="card"><div className="section-title"><h2>{'Ch\u1ec9 s\u1ed1 t\u1ea5n c\u00f4ng'}</h2><span>{'B\u00e0n th\u1eafng / tr\u1eadn'}</span></div>{data.attack.map((item) => <p className="rank-line" key={item.team}><b>{teamLabel(item.team)}</b><span>{item.value}</span></p>)}</div>
      <div className="card"><div className="section-title"><h2>{'Ch\u1ec9 s\u1ed1 ph\u00f2ng ng\u1ef1'}</h2><span>{'B\u00e0n thua / tr\u1eadn'}</span></div>{data.defense.map((item) => <p className="rank-line" key={item.team}><b>{teamLabel(item.team)}</b><span>{item.value}</span></p>)}</div>
      <div className="card"><div className="section-title"><h2>{'Phong \u0111\u1ed9'}</h2><span>{'\u0110\u00e0 thi \u0111\u1ea5u g\u1ea7n \u0111\u00e2y'}</span></div>{data.form.map((item) => <p className="rank-line" key={item.team}><b>{teamLabel(item.team)}</b><span>{item.value}</span></p>)}</div>
    </section>
  );
}
