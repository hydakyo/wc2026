"use client";
import React from 'react';
import type { Event } from '../../types/espn';
import MatchCard from './MatchCard';
import '../../styles/MatchList.css';

interface MatchListProps {
  title: string;
  matches: Event[];
}

const MatchList: React.FC<MatchListProps> = ({ title, matches }) => {
  if (matches.length === 0) return null;

  return (
    <section className="match-section">
      <h2 className="section-title">{title}</h2>
      <div className="match-grid">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </section>
  );
};

export default MatchList;


