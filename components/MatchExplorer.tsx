'use client';

import { useMemo, useState } from 'react';
import { formatKickoff, groups, matches } from '@/lib/worldcup-data';
import { MatchCard } from './Cards';

export function MatchExplorer() {
  const [status, setStatus] = useState('ALL');
  const [group, setGroup] = useState('ALL');
  const filtered = useMemo(() => matches.filter((match) => (status === 'ALL' || match.status === status) && (group === 'ALL' || match.group === group)), [status, group]);
  return (
    <section className="card">
      <div className="section-title"><h2>Match Explorer</h2><span>{filtered.length} matches</span></div>
      <div className="filters">
        {['ALL', 'LIVE', 'FT', 'SCHEDULED'].map((item) => <button className={status === item ? 'active' : ''} key={item} onClick={() => setStatus(item)}>{item}</button>)}
        <select value={group} onChange={(event) => setGroup(event.target.value)}><option value="ALL">All groups</option>{groups.map((g) => <option key={g} value={g}>Group {g}</option>)}</select>
      </div>
      <div className="grid match-list">{filtered.map((match) => <MatchCard key={match.id} match={match} dense={match.status !== 'LIVE'} />)}</div>
      <p className="subtle">Kickoff display sample: {formatKickoff(filtered[0]?.kickoff ?? new Date().toISOString())}</p>
    </section>
  );
}
