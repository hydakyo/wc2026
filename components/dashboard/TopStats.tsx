"use client";
import React, { useCallback, useEffect, useState } from 'react';
import { fetchStandings, fetchStatistics } from '../../utils/api';
import type { ESPNStandingsResponse, ESPNStatsResponse, Leader, StandingsEntry, StatValue } from '../../types/espn';
import { translateTeamName } from '../../utils/translations';
import Loader from './Loader';
import '../../styles/TopStats.css';

const REFRESH_INTERVAL_MS = 30000;
const TEAM_LEADER_LIMIT = 12;

type TeamLeader = {
  id: string;
  name: string;
  logo?: string;
  group: string;
  primary: number;
  primaryDisplay: string;
  secondary: string;
};

const TopStats: React.FC = () => {
  const [data, setData] = useState<ESPNStatsResponse | null>(null);
  const [standings, setStandings] = useState<ESPNStandingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const [statisticsResponse, standingsResponse] = await Promise.allSettled([
        fetchStatistics(),
        fetchStandings()
      ]);

      if (statisticsResponse.status === 'fulfilled') setData(statisticsResponse.value);
      if (standingsResponse.status === 'fulfilled') setStandings(standingsResponse.value);
      if (statisticsResponse.status === 'rejected' && standingsResponse.status === 'rejected') {
        setError('Không thể tải dữ liệu thống kê.');
      } else {
        setError(null);
      }
    } catch (err) {
      setError('Không thể tải dữ liệu thống kê.');
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats(true);
    const interval = window.setInterval(() => loadStats(false), REFRESH_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [loadStats]);

  if (loading) return <Loader message="Đang tải thống kê..." />;
  if (error) return <div className="dashboard-error">⚠️ {error}</div>;
  if ((!data || !data.stats) && !standings) return <div>Không có dữ liệu thống kê.</div>;

  const teamRows = standingsToTeamRows(standings);
  const topScoringTeams = [...teamRows]
    .sort((a, b) => b.primary - a.primary || b.secondary.localeCompare(a.secondary) || a.name.localeCompare(b.name))
    .slice(0, TEAM_LEADER_LIMIT);
  const bestDefenses = teamRows
    .map((row) => ({ ...row, primary: statNumber(rowEntry(row.id, standings), ['A', 'pointsAgainst']) ?? row.primary, primaryDisplay: statDisplay(rowEntry(row.id, standings), ['A', 'pointsAgainst']) ?? String(row.primary) }))
    .sort((a, b) => a.primary - b.primary || a.name.localeCompare(b.name))
    .slice(0, TEAM_LEADER_LIMIT);
  const pointsTable = teamRows
    .map((row) => ({ ...row, primary: statNumber(rowEntry(row.id, standings), ['P', 'points']) ?? row.primary, primaryDisplay: statDisplay(rowEntry(row.id, standings), ['P', 'points']) ?? String(row.primary) }))
    .sort((a, b) => b.primary - a.primary || compareGoalDifference(rowEntry(b.id, standings), rowEntry(a.id, standings)) || a.name.localeCompare(b.name))
    .slice(0, TEAM_LEADER_LIMIT);

  return (
    <div className="stats-grid fade-in">
      {data?.stats?.map(category => (
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
      <TeamLeaderCard title="🔥 Đội ghi bàn nhiều" rows={topScoringTeams} valueSuffix="BT" />
      <TeamLeaderCard title="🛡️ Thủng lưới ít" rows={bestDefenses} valueSuffix="BB" lowerIsBetter />
      <TeamLeaderCard title="📈 Phong độ / điểm bảng" rows={pointsTable} valueSuffix="đ" />
    </div>
  );
};

function TeamLeaderCard({ title, rows, valueSuffix, lowerIsBetter = false }: { title: string; rows: TeamLeader[]; valueSuffix: string; lowerIsBetter?: boolean }) {
  if (!rows.length) return null;

  return (
    <div className="stats-card">
      <h3 className="category-title">{title}</h3>
      <ul className="leader-list">
        {rows.map((row, idx) => (
          <li key={`${title}-${row.id}`} className="leader-item">
            <div className="leader-rank">{idx + 1}</div>
            {row.logo ? (
              <img src={row.logo} alt={row.name} className="leader-img team-leader-logo" />
            ) : (
              <div className="leader-img-placeholder">🏳️</div>
            )}
            <div className="leader-info">
              <div className="leader-name">{row.name}</div>
              <div className="leader-team">{row.group} · {row.secondary}</div>
            </div>
            <div className={`leader-value ${lowerIsBetter ? 'defense-value' : ''}`}>{row.primaryDisplay}<span className="leader-unit">{valueSuffix}</span></div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function standingsToTeamRows(data: ESPNStandingsResponse | null): TeamLeader[] {
  if (!data?.children?.length) return [];

  return data.children.flatMap((group) => {
    const groupName = (group.name || group.abbreviation || '').replace('Group', 'Bảng');
    return (group.standings?.entries ?? []).map((entry) => {
      const goalsFor = statNumber(entry, ['F', 'pointsFor']) ?? 0;
      const goalDifference = statDisplay(entry, ['GD', 'pointDifferential']) ?? 'HS 0';
      const record = statDisplay(entry, ['Total', 'overall']);
      const points = statDisplay(entry, ['P', 'points']) ?? '0';
      return {
        id: entry.team.id,
        name: translateTeamName(entry.team.shortDisplayName || entry.team.displayName || entry.team.name || entry.team.abbreviation),
        logo: entry.team.logos?.[0]?.href || entry.team.logo,
        group: groupName,
        primary: goalsFor,
        primaryDisplay: statDisplay(entry, ['F', 'pointsFor']) ?? String(goalsFor),
        secondary: record ? `${record} · ${points}đ · HS ${goalDifference}` : `${points}đ · HS ${goalDifference}`
      };
    });
  });
}

function rowEntry(teamId: string, data: ESPNStandingsResponse | null): StandingsEntry | undefined {
  return data?.children?.flatMap((group) => group.standings?.entries ?? []).find((entry) => entry.team.id === teamId);
}

function statNumber(entry: StandingsEntry | undefined, keys: string[]) {
  const stat = findStat(entry?.stats ?? [], keys);
  return typeof stat?.value === 'number' ? stat.value : undefined;
}

function statDisplay(entry: StandingsEntry | undefined, keys: string[]) {
  return findStat(entry?.stats ?? [], keys)?.displayValue;
}

function findStat(stats: StatValue[], keys: string[]) {
  const normalizedKeys = keys.map(normalizeStatKey);
  return stats.find((item) => {
    const candidates = [item.abbreviation, item.name, item.displayName, item.shortDisplayName].map(normalizeStatKey);
    return candidates.some((candidate) => normalizedKeys.includes(candidate));
  });
}

function compareGoalDifference(left: StandingsEntry | undefined, right: StandingsEntry | undefined) {
  return (statNumber(left, ['GD', 'pointDifferential']) ?? 0) - (statNumber(right, ['GD', 'pointDifferential']) ?? 0);
}

function normalizeStatKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export default TopStats;
