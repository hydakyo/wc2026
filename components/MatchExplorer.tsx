'use client';

import { useMemo, useState } from 'react';
import { formatKickoff, groups, matches, statusLabel } from '@/lib/worldcup-data';
import { MatchCard } from './Cards';

const statusFilters = ['ALL', 'LIVE', 'FT', 'SCHEDULED'];

export function MatchExplorer() {
  const [status, setStatus] = useState('ALL');
  const [group, setGroup] = useState('ALL');
  const filtered = useMemo(() => matches.filter((match) => (status === 'ALL' || match.status === status) && (group === 'ALL' || match.group === group)), [status, group]);
  return (
    <section className="card">
      <div className="section-title"><h2>{'Trung t\u00e2m tr\u1eadn \u0111\u1ea5u'}</h2><span>{filtered.length} {'tr\u1eadn'}</span></div>
      <div className="filters">
        {statusFilters.map((item) => <button className={status === item ? 'active' : ''} key={item} onClick={() => setStatus(item)}>{item === 'ALL' ? 'T\u1ea5t c\u1ea3' : statusLabel(item)}</button>)}
        <select value={group} onChange={(event) => setGroup(event.target.value)}><option value="ALL">{'T\u1ea5t c\u1ea3 b\u1ea3ng'}</option>{groups.map((g) => <option key={g} value={g}>Bảng {g}</option>)}</select>
      </div>
      <div className="grid match-list">{filtered.map((match) => <MatchCard key={match.id} match={match} dense={match.status !== 'LIVE'} />)}</div>
      <p className="subtle">{'M\u1eabu hi\u1ec3n th\u1ecb gi\u1edd thi \u0111\u1ea5u'}: {formatKickoff(filtered[0]?.kickoff ?? new Date().toISOString())}</p>
    </section>
  );
}
