'use client';

import { useMemo, useState } from 'react';
import { groupsForData, type TournamentData } from '@/lib/live-data';
import { statusLabel } from '@/lib/worldcup-data';
import { MatchCard } from './Cards';

const statusFilters = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'LIVE', label: 'Đang diễn ra' },
  { value: 'SCHEDULED', label: 'Sắp diễn ra' },
  { value: 'FT', label: 'Đã kết thúc' }
];

export function MatchExplorer({ data }: { data: TournamentData }) {
  const [status, setStatus] = useState('ALL');
  const [group, setGroup] = useState('ALL');
  const groups = groupsForData(data);

  const filtered = useMemo(
    () =>
      data.matches.filter((match) => {
        const statusMatch = status === 'ALL' || (status === 'LIVE' ? match.status === 'LIVE' || match.status === 'HT' : match.status === status);
        const groupMatch = group === 'ALL' || match.group === group;
        return statusMatch && groupMatch;
      }),
    [data.matches, status, group]
  );

  const liveCount = data.matches.filter((match) => match.status === 'LIVE' || match.status === 'HT').length;
  const scheduledCount = data.matches.filter((match) => match.status === 'SCHEDULED').length;
  const finishedCount = data.matches.filter((match) => match.status === 'FT').length;
  const totalGoals = data.matches.reduce((sum, match) => sum + (match.homeScore ?? 0) + (match.awayScore ?? 0), 0);

  return (
    <section className="match-dashboard">
      <aside className="dashboard-side filters-side">
        <div className="card filter-panel">
          <div className="section-title">
            <h2>Bộ lọc trận đấu</h2>
            <span>{filtered.length} trận</span>
          </div>

          <div className="filter-group">
            <span className="filter-label">Trạng thái</span>
            <div className="filters segmented-filters">
              {statusFilters.map((item) => (
                <button className={status === item.value ? 'active' : ''} key={item.value} onClick={() => setStatus(item.value)} type="button">
                  {item.value === 'ALL' ? item.label : statusLabel(item.value)}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label">Bảng đấu</span>
            <div className="group-filter-grid">
              <button className={group === 'ALL' ? 'active' : ''} onClick={() => setGroup('ALL')} type="button">
                Tất cả
              </button>
              {groups.map((item) => (
                <button className={group === item ? 'active' : ''} key={item} onClick={() => setGroup(item)} type="button">
                  Bảng {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card stat-panel">
          <div className="section-title">
            <h2>Số liệu tổng quan</h2>
            <span>Realtime</span>
          </div>
          <div className="stat-list">
            <div><span>Đang diễn ra</span><strong>{liveCount}</strong></div>
            <div><span>Sắp diễn ra</span><strong>{scheduledCount}</strong></div>
            <div><span>Đã kết thúc</span><strong>{finishedCount}</strong></div>
            <div><span>Tổng bàn thắng</span><strong>{totalGoals}</strong></div>
          </div>
        </div>
      </aside>

      <div className="dashboard-main">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Tất cả trận đấu</p>
            <h2>{group === 'ALL' ? 'Lịch thi đấu và kết quả' : `Bảng ${group}`}</h2>
          </div>
          <span>{status === 'ALL' ? 'Tất cả trạng thái' : statusLabel(status)}</span>
        </div>

        {filtered.length ? (
          <div className="stack-list match-stack">
            {filtered.map((match) => (
              <MatchCard key={match.id} match={match} dense={match.status !== 'LIVE' && match.status !== 'HT'} />
            ))}
          </div>
        ) : (
          <div className="empty-panel">Không có trận phù hợp với bộ lọc hiện tại.</div>
        )}
      </div>
    </section>
  );
}
