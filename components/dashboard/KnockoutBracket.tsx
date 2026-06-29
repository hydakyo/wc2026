"use client";

import React, { useMemo } from 'react';
import type { TournamentData } from '@/lib/production-data';
import { bracketStatusLabel, teamLabel } from '@/lib/worldcup-data';
import '../../styles/KnockoutBracket.css';

type BracketItem = TournamentData['bracket'][number];

type RoundConfig = {
  round: string;
  title: string;
};

type KnockoutBracketProps = {
  tournamentData: TournamentData;
};

const ROUND_ORDER: RoundConfig[] = [
  { round: 'Round of 32', title: 'Vòng 32 đội' },
  { round: 'Round of 16', title: 'Vòng 16 đội' },
  { round: 'Quarter-final', title: 'Tứ kết' },
  { round: 'Semi-final', title: 'Bán kết' },
  { round: 'Final', title: 'Chung kết' }
];

const KnockoutBracket: React.FC<KnockoutBracketProps> = ({ tournamentData }) => {
  const rounds = useMemo(() => roundsFromProductionData(tournamentData.bracket), [tournamentData.bracket]);

  if (!tournamentData.bracket.length) {
    return (
      <div className="bracket-container fade-in">
        <p className="bracket-note">
          Provider chưa có dữ liệu nhánh knock-out từ <b>getProductionTournamentData()</b>. Khi production data có bracket, hệ thống sẽ hiển thị tại đây.
        </p>
        {tournamentData.source.warning ? <div className="dashboard-empty">{tournamentData.source.warning}</div> : null}
      </div>
    );
  }

  return (
    <div className="bracket-container fade-in">
      <p className="bracket-note">
        Dữ liệu vòng knock-out được lấy từ <b>getProductionTournamentData()</b>. UI chỉ render dữ liệu production, không gọi riêng ESPN standings/scoreboard ở component bracket.
      </p>

      <div className="bracket-scroll-area">
        <div className="bracket-stages">
          {rounds.map(({ round, title, matches }, roundIndex) => (
            <div key={round} className="bracket-round">
              <h3 className="round-title">{title}</h3>
              <div className="round-matches">
                {matches.map((match, idx) => (
                  <div className={`bracket-match-wrapper round-${roundIndex}`} key={`${round}-${idx}`}>
                    <div className={`mock-match-card ${statusClass(match.status)}`}>
                      <div className="mock-team"><span>{entrantLabel(match.left)}</span></div>
                      <div className="mock-divider"></div>
                      <div className="mock-team"><span>{entrantLabel(match.right)}</span></div>
                      <div className="mock-status">{bracketStatusLabel(match.status)}</div>
                    </div>
                    {roundIndex < rounds.length - 1 && (
                      <div className={`connector-line connector-${idx % 2 === 0 ? 'top' : 'bottom'}`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function roundsFromProductionData(bracket: BracketItem[]) {
  const knownRounds = ROUND_ORDER
    .map(({ round, title }) => ({ round, title, matches: bracket.filter((item) => item.round === round) }))
    .filter((item) => item.matches.length > 0);

  const knownRoundNames = new Set(ROUND_ORDER.map((item) => item.round));
  const extraRounds = Array.from(new Set(bracket.map((item) => item.round)))
    .filter((round) => !knownRoundNames.has(round))
    .map((round) => ({ round, title: round, matches: bracket.filter((item) => item.round === round) }));

  return [...knownRounds, ...extraRounds];
}

function entrantLabel(value: string) {
  if (value === 'TBD') return 'Chờ xác định';
  if (value.startsWith('Winner ')) return value.replace('Winner ', 'Thắng ');
  return teamLabel(value, false);
}

function statusClass(status: string) {
  const value = status.toLowerCase();
  if (value.includes('official')) return 'official';
  if (value.includes('projected')) return 'projected';
  return 'pending';
}

export default KnockoutBracket;
