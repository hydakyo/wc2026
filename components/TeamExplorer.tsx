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
      <div className="section-title"><h2>Team Intelligence Center</h2><span>{rows.length} teams</span></div>
      <div className="filters"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search team or code" /><select value={group} onChange={(event) => setGroup(event.target.value)}><option value="ALL">All groups</option>{groups.map((g) => <option key={g} value={g}>Group {g}</option>)}</select></div>
      <div className="team-grid">{rows.map((row) => <article className="team-card" key={row.team}><div className="flag">{row.flag}</div><h3>{row.name}</h3><p>{row.team} · Group {row.group} · Rank #{row.fifaRank}</p><div className="team-stats"><span>{row.points} pts</span><span>{row.gf} GF</span><span>{row.ga} GA</span><span>{row.form}</span></div></article>)}</div>
    </section>
  );
}
