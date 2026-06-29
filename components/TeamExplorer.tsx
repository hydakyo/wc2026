'use client';

import { useMemo, useState } from 'react';
import { groups, teamAnalytics, teams } from '@/lib/worldcup-data';

export function TeamExplorer() {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('ALL');
  const rows = useMemo(() => teamAnalytics().filter((row) => {
    const team = teams.find((item) => item.code === row.team);
    const q = query.toLowerCase();
    return (group === 'ALL' || team?.group === group) && (!q || team?.name.toLowerCase().includes(q) || row.team.toLowerCase().includes(q));
  }), [query, group]);
  return (
    <section className="card">
      <div className="section-title"><h2>{'Trung t\u00e2m ph\u00e2n t\u00edch \u0111\u1ed9i tuy\u1ec3n'}</h2><span>{rows.length} {'\u0111\u1ed9i'}</span></div>
      <div className="filters"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="T\u00ecm theo t\u00ean \u0111\u1ed9i ho\u1eb7c m\u00e3" /><select value={group} onChange={(event) => setGroup(event.target.value)}><option value="ALL">{'T\u1ea5t c\u1ea3 b\u1ea3ng'}</option>{groups.map((g) => <option key={g} value={g}>Bảng {g}</option>)}</select></div>
      <div className="team-grid">{rows.map((row) => <article className="team-card" key={row.team}><div className="flag">{row.flag}</div><h3>{row.name}</h3><p>{row.team} · Bảng {row.group} · Hạng FIFA #{row.fifaRank}</p><div className="team-stats"><span>{row.points} điểm</span><span>{row.gf} BT</span><span>{row.ga} BB</span><span>{row.form}</span></div></article>)}</div>
    </section>
  );
}
