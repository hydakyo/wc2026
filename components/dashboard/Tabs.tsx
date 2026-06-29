"use client";
import React from 'react';
import '../../styles/Tabs.css';

interface TabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'matches', label: '🏟️ Lịch thi đấu' },
    { id: 'standings', label: '📊 Bảng xếp hạng' },
    { id: 'bracket', label: '🏆 Vòng Knockout' },
    { id: 'stats', label: '⭐ Top Thống kê' },
  ];

  return (
    <div className="tabs-container">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;


