'use client';

import { useMemo, useState } from 'react';
import { groupsForData, type TournamentData } from '@/lib/live-data';
import { formatKickoff, statusLabel } from '@/lib/worldcup-data';
import { MatchCard } from './Cards';

const statusFilters = ['ALL', 'LIVE', 'FT', 'SCHEDULED'];

export function MatchExplorer({ data }: { data: TournamentData }) {
  const [status, setStatus] = useState('ALL');
  const [group, setGroup] = useState('ALL');
  const groups = groupsForData(data);
  const filtered = useMemo(() => data.matches.filter((match) => (status === 'ALL' || match.status === status) && (group === 'ALL' || match.group === group)), [data.matches, status, group]);
  return (
    <section className="card">
      <div className="section-title"><h2>Trung tâm trận đấu</h2><span>{filtered.length} trận</span></div>
      <div className="filters">
        {statusFilters.map((item) => <button className={status === item ? 'active' : ''} key={item} onClick={() => setStatus(item)}>{item === 'ALL' ? 'Tất cả' : statusLabel(item)}</button>)}
        <select value={group} onChange={(event) => setGroup(event.target.value)}><option value="ALL">Tất cả bảng</option>{groups.map((g) => <option key={g} value={g}>Bảng {g}</option>)}</select>
      </div>
      <div className="grid match-list">{filtered.map((match) => <MatchCard key={match.id} match={match} dense={match.status !== 'LIVE'} />)}</div>
      <p className="subtle">Mẫu hiển thị giờ thi đấu: {formatKickoff(filtered[0]?.kickoff ?? new Date().toISOString())}</p>
    </section>
  );
}
