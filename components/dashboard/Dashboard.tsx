"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { fetchScoreboard } from '../../utils/api';
import type { ESPNScoreboardResponse } from '../../types/espn';
import MatchList from './MatchList';
import Loader from './Loader';
import Tabs from './Tabs';
import Standings from './Standings';
import TopStats from './TopStats';
import KnockoutBracket from './KnockoutBracket';
import '../../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<ESPNScoreboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('matches');

  const loadData = useCallback(async (isInitial = false) => {
    // Only set loading for initial fetch of scoreboard
    if (isInitial && activeTab === 'matches') setLoading(true);
    try {
      const response = await fetchScoreboard();
      setData(response);
      setError(null);
    } catch (err) {
      setError('Không thể tải dữ liệu từ ESPN.');
      console.error(err);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadData(true);
    const interval = setInterval(() => {
      loadData(false);
    }, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  const renderContent = () => {
    if (activeTab === 'standings') return <Standings />;
    if (activeTab === 'stats') return <TopStats />;
    if (activeTab === 'bracket') return <KnockoutBracket />;

    // Default to 'matches'
    if (loading) return <Loader message="Đang tải dữ liệu World Cup..." />;
    if (error) return (
      <div className="dashboard-error">
        <p>⚠️ {error}</p>
        <button onClick={() => loadData(true)}>Thử lại</button>
      </div>
    );
    if (!data || !data.events) return <div className="dashboard-empty">Không có dữ liệu trận đấu vào lúc này.</div>;

    const liveMatches = data.events.filter(e => e.status.type.state === 'in');
    const upcomingMatches = data.events.filter(e => e.status.type.state === 'pre');
    const completedMatches = data.events.filter(e => e.status.type.state === 'post');

    return (
      <>
        <MatchList title="🔴 Đang diễn ra" matches={liveMatches} />
        <MatchList title="📅 Sắp diễn ra" matches={upcomingMatches} />
        <MatchList title="✅ Đã kết thúc" matches={completedMatches} />
      </>
    );
  };

  return (
    <main className="dashboard-container">
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
    </main>
  );
};

export default Dashboard;


