"use client";
import React from 'react';
import '../../styles/Header.css';

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo-section">
          <div className="logo-icon">🏆</div>
          <div className="logo-text">
            <h1>World Cup 2026</h1>
            <span className="subtitle">Cập nhật trực tiếp</span>
          </div>
        </div>
        <div className="header-status">
          <span className="live-indicator"></span>
          <span>Đang cập nhật trực tiếp</span>
        </div>
      </div>
    </header>
  );
};

export default Header;


