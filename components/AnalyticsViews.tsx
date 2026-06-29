import { analyticsForData, type TournamentData } from '@/lib/live-data';
import { teamLabel } from '@/lib/worldcup-data';

export function AnalyticsViews({ data }: { data: TournamentData }) {
  const analytics = analyticsForData(data);
  return (
    <section className="grid analytics-grid">
      <div className="card"><div className="section-title"><h2>Chỉ số tấn công</h2><span>Bàn thắng / trận</span></div>{analytics.attack.map((item) => <p className="rank-line" key={item.team}><b>{teamLabel(item.team)}</b><span>{item.value}</span></p>)}</div>
      <div className="card"><div className="section-title"><h2>Chỉ số phòng ngự</h2><span>Bàn thua / trận</span></div>{analytics.defense.map((item) => <p className="rank-line" key={item.team}><b>{teamLabel(item.team)}</b><span>{item.value}</span></p>)}</div>
      <div className="card"><div className="section-title"><h2>Phong độ</h2><span>Đà thi đấu gần đây</span></div>{analytics.form.map((item) => <p className="rank-line" key={item.team}><b>{teamLabel(item.team)}</b><span>{item.value}</span></p>)}</div>
    </section>
  );
}
