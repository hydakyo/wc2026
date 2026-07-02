"use client";
import React from 'react';
import { teams as fallbackTeams } from '@/lib/worldcup-data';
import type { Competitor, Event, Team } from '../../types/espn';
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
    if (isPost) return `Kết thúc · ${formatMatchDate(match.date)}`;
    if (isPre) return formatKickoff(match.date);
    return translateMatchStatus(status.type.shortDetail || status.type.description);
  };

  return (
    <div className={`match-card fade-in ${isLive ? 'is-live' : ''}`}>
      <div className="match-card-header">
        <span className="match-status">{formatTime()}</span>
        <span className="match-venue">{competition.venue?.fullName || match.shortName}</span>
      </div>

      <div className="match-teams">
        <TeamRow competitor={homeTeam} isPre={isPre} />
        <TeamRow competitor={awayTeam} isPre={isPre} />
      </div>
    </div>
  );
};

function TeamRow({ competitor, isPre }: { competitor: Competitor; isPre: boolean }) {
  const display = teamDisplay(competitor.team);

  return (
    <div className={`team ${competitor.winner ? 'winner' : ''}`}>
      {display.logo ? (
        <img src={display.logo} alt={display.name} className="team-logo" />
      ) : display.flag ? (
        <span className="team-flag" aria-hidden="true">{display.flag}</span>
      ) : (
        <span className="team-slot-placeholder" aria-hidden="true">TBD</span>
      )}
      <div className="team-info">
        <span className="team-name">{display.name}</span>
      </div>
      <span className="team-score">{isPre ? '-' : competitor.score}</span>
    </div>
  );
}

function teamDisplay(team: Team) {
  const fallback = fallbackTeams.find((item) => item.code === team.abbreviation);
  return {
    name: formatTeamName(team),
    logo: team.logos?.[0]?.href || team.logo || undefined,
    flag: fallback?.flag
  };
}

function formatTeamName(team: Team) {
  const rawName = team.shortDisplayName || team.displayName || team.name || team.abbreviation;
  const shortPlaceholder = rawName.match(/^(?:RD|R)(\d+)\s*W(\d+)$/i);
  const longPlaceholder = rawName.match(/Round of (\d+) (\d+) Winner/i);

  if (shortPlaceholder) return `Thắng R${shortPlaceholder[1]}-${shortPlaceholder[2]}`;
  if (longPlaceholder) return `Thắng R${longPlaceholder[1]}-${longPlaceholder[2]}`;
  if (!team.logo && /winner/i.test(rawName)) return 'Chưa xác định';

  return translateTeamName(rawName);
}

function formatKickoff(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--/-- --:--';
  const time = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${formatDateParts(date)} · ${time}`;
}

function formatMatchDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--/--';
  return formatDateParts(date);
}

function formatDateParts(date: Date) {
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export default MatchCard;
