"use client";
import React, { useEffect, useState } from 'react';
import { fetchStandings } from '../../utils/api';
import type { ESPNStandingsResponse } from '../../types/espn';
import { translateTeamName } from '../../utils/translations';
import Loader from './Loader';
import '../../styles/Standings.css';

const Standings: React.FC = () => {
  const [data, setData] = useState<ESPNStandingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStandings = async () => {
      try {
        const response = await fetchStandings();
        setData(response);
      } catch (err) {
        setError('Không thể tải dữ liệu bảng xếp hạng.');
      } finally {
        setLoading(false);
      }
    };
    loadStandings();
  }, []);

  if (loading) return <Loader message="Đang tải bảng xếp hạng..." />;
  if (error) return <div className="dashboard-error">⚠️ {error}</div>;
  if (!data || !data.children) return <div>Không có dữ liệu.</div>;

  const getStat = (stats: any[], abbrev: string) => {
    const stat = stats.find(s => s.abbreviation === abbrev);
    return stat ? stat.displayValue : '0';
  };

  return (
    <div className="standings-grid fade-in">
      {data.children.map(group => (
        <div key={group.id} className="standings-card">
          <h3 className="group-title">{group.name.replace('Group', 'Bảng')}</h3>
          <table className="standings-table">
            <thead>
              <tr>
                <th>#</th>
                <th className="team-col">Đội</th>
                <th title="Trận">Tr</th>
                <th title="Thắng">T</th>
                <th title="Hòa">H</th>
                <th title="Thua">B</th>
                <th title="Hiệu số">HS</th>
                <th title="Điểm">Đ</th>
              </tr>
            </thead>
            <tbody>
              {group.standings.entries.map((entry, idx) => {
                const rank = getStat(entry.stats, 'R');
                const isAdvanced = entry.note?.description.includes('Advance') || idx < 2; // Tạm logic highlight top 2
                return (
                  <tr key={entry.team.id} className={isAdvanced ? 'advanced' : ''}>
                    <td className="rank-col">{rank}</td>
                    <td className="team-col">
                      <img src={entry.team.logos?.[0]?.href || entry.team.logo} alt={entry.team.abbreviation} className="standings-logo" />
                      <span className="standings-team-name">{translateTeamName(entry.team.shortDisplayName || entry.team.name)}</span>
                    </td>
                    <td>{getStat(entry.stats, 'GP')}</td>
                    <td>{getStat(entry.stats, 'W')}</td>
                    <td>{getStat(entry.stats, 'D')}</td>
                    <td>{getStat(entry.stats, 'L')}</td>
                    <td>{getStat(entry.stats, 'GD')}</td>
                    <td className="points-col">{getStat(entry.stats, 'P')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default Standings;


