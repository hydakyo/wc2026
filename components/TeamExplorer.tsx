'use client';

import { useMemo, useState } from 'react';
import { groupsForData, teamAnalyticsForData, type TournamentData } from '@/lib/live-data';

export function TeamExplorer({ data }: { data: TournamentData }) {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('ALL');
  const groups = groupsForData(data);
  const rows = useMemo(() => teamAnalyticsForData(data).filter((row) => {
    const q = query.toLowerCase();
    return (group === 'ALL' || row.group === group) && (!q || row.name.toLowerCase().includes(q) || row.team.toLowerCase().includes(q));
  }), [data, query, group]);
  return (
    <section className="card">
      <div className="section-title"><h2>Trung tâm phân tích đội tuyển</h2><span>{rows.length} đội</span></div>
      <div className="filters"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm đội tuyển" /><select value={group} onChange={(event) => setGroup(event.target.value)}><option value="ALL">Tất cả bảng</option>{groups.map((g) => <option key={g} value={g}>Bảng {g}</option>)}</select></div>
      <div className="team-grid">{rows.map((row) => <article className="team-card" key={row.team}><div className="flag">{row.flag}</div><h3>{row.name}</h3><p>{row.team} · Bảng {row.group} · Hạng #{row.fifaRank}</p><div className="team-stats"><span>{row.points} điểm</span><span>{row.gf} BT</span><span>{row.ga} BB</span><span>{row.form}</span></div></article>)}</div>
    </section>
  );
}
