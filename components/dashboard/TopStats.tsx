"use client";
import React, { useEffect, useState } from 'react';
import { fetchStatistics } from '../../utils/api';
import type { ESPNStatsResponse, Leader } from '../../types/espn';
import { translateTeamName } from '../../utils/translations';
import Loader from './Loader';
import '../../styles/TopStats.css';

const TopStats: React.FC = () => {
  const [data, setData] = useState<ESPNStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetchStatistics();
        setData(response);
      } catch (err) {
        setError('Không thể tải dữ liệu thống kê.');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <Loader message="Đang tải thống kê..." />;
  if (error) return <div className="dashboard-error">⚠️ {error}</div>;
  if (!data || !data.stats) return <div>Không có dữ liệu thống kê.</div>;

  return (
    <div className="stats-grid fade-in">
      {data.stats.map(category => (
        <div key={category.name} className="stats-card">
          <h3 className="category-title">{category.displayName === 'Goals' ? '⚽ Vua phá lưới' : category.displayName === 'Assists' ? '👟 Kiến tạo' : category.displayName}</h3>
          <ul className="leader-list">
            {category.leaders.map((leader: Leader, idx: number) => (
              <li key={leader.athlete.id} className="leader-item">
                <div className="leader-rank">{idx + 1}</div>
                {leader.athlete.headshot?.href ? (
                  <img src={leader.athlete.headshot.href} alt={leader.athlete.displayName} className="leader-img" />
                ) : (
                  <div className="leader-img-placeholder">👤</div>
                )}
                <div className="leader-info">
                  <div className="leader-name">{leader.athlete.displayName}</div>
                  <div className="leader-team">
                    {leader.athlete.team?.logo && <img src={leader.athlete.team.logo} alt="" className="tiny-logo" />}
                    {translateTeamName(leader.athlete.team?.displayName || '')}
                  </div>
                </div>
                <div className="leader-value">{leader.value}</div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TopStats;


