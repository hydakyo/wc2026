import { analytics, teamLabel } from '@/lib/worldcup-data';

export function AnalyticsViews() {
  const data = analytics();
  return (
    <section className="grid analytics-grid">
      <div className="card"><div className="section-title"><h2>Attack Index</h2><span>GF per match</span></div>{data.attack.map((item) => <p className="rank-line" key={item.team}><b>{teamLabel(item.team)}</b><span>{item.value}</span></p>)}</div>
      <div className="card"><div className="section-title"><h2>Defense Index</h2><span>GA per match</span></div>{data.defense.map((item) => <p className="rank-line" key={item.team}><b>{teamLabel(item.team)}</b><span>{item.value}</span></p>)}</div>
      <div className="card"><div className="section-title"><h2>Form Table</h2><span>Recent momentum</span></div>{data.form.map((item) => <p className="rank-line" key={item.team}><b>{teamLabel(item.team)}</b><span>{item.value}</span></p>)}</div>
    </section>
  );
}
