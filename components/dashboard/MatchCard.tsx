"use client";
import React from 'react';
import type { Event } from '../../types/espn';
import { translateTeamName, translateMatchStatus } from '../../utils/translations';
import '../../styles/MatchCard.css';

interface MatchCardProps {
  match: Event;
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  // Try to find the competition within the event
  const competition = match.competitions?.[0];
  if (!competition) return null;

  const competitors = competition.competitors || [];
  const homeTeam = competitors.find(c => c.homeAway === 'home');
  const awayTeam = competitors.find(c => c.homeAway === 'away');

  if (!homeTeam || !awayTeam) return null;

  const status = competition.status;
  const isLive = status.type.state === 'in';
  const isPost = status.type.state === 'post';
  const isPre = status.type.state === 'pre';

  const formatTime = () => {
    if (isLive) return <span className="live-time"><span className="live-indicator"></span>{status.displayClock}</span>;
    if (isPost) return 'Kết thúc';
    if (isPre) {
      const date = new Date(match.date);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return translateMatchStatus(status.type.shortDetail || status.type.description);
  };

  return (
    <div className={`match-card fade-in ${isLive ? 'is-live' : ''}`}>
      <div className="match-card-header">
        <span className="match-status">{formatTime()}</span>
        <span className="match-venue">{competition.venue?.fullName || match.shortName}</span>
      </div>

      <div className="match-teams">
        {/* Home Team */}
        <div className={`team ${homeTeam.winner ? 'winner' : ''}`}>
          <img src={homeTeam.team.logo} alt={homeTeam.team.displayName} className="team-logo" />
          <div className="team-info">
            <span className="team-name">{translateTeamName(homeTeam.team.shortDisplayName)}</span>
          </div>
          <span className="team-score">{isPre ? '-' : homeTeam.score}</span>
        </div>

        {/* Away Team */}
        <div className={`team ${awayTeam.winner ? 'winner' : ''}`}>
          <img src={awayTeam.team.logo} alt={awayTeam.team.displayName} className="team-logo" />
          <div className="team-info">
            <span className="team-name">{translateTeamName(awayTeam.team.shortDisplayName)}</span>
          </div>
          <span className="team-score">{isPre ? '-' : awayTeam.score}</span>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;


