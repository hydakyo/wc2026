"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchScoreboard } from '../../utils/api';
import type { Event } from '../../types/espn';
import MatchCard from './MatchCard';
import Loader from './Loader';
import '../../styles/KnockoutBracket.css';

const REFRESH_INTERVAL_MS = 30000;

const ROUNDS = [
  { id: 'round-of-32', title: 'Vòng 32 đội', matchCount: 16, placeholder: 'R32' },
  { id: 'round-of-16', title: 'Vòng 16 đội', matchCount: 8, placeholder: 'R16' },
  { id: 'quarterfinals', title: 'Tứ kết', matchCount: 4, placeholder: 'QF' },
  { id: 'semifinals', title: 'Bán kết', matchCount: 2, placeholder: 'SF' },
  { id: 'final', title: 'Chung kết', matchCount: 1, placeholder: 'F' }
] as const;

const BRACKET_BASE_MATCHES = ROUNDS[0].matchCount;
const BRACKET_ROUND_WIDTH = 250;
const BRACKET_ROUND_GAP = 84;
const BRACKET_CARD_HEIGHT = 132;
const BRACKET_LANE_HEIGHT = 136;
const BRACKET_TITLE_HEIGHT = 60;
const BRACKET_CONTENT_HEIGHT = BRACKET_BASE_MATCHES * BRACKET_LANE_HEIGHT;
const BRACKET_WIDTH = ROUNDS.length * BRACKET_ROUND_WIDTH + (ROUNDS.length - 1) * BRACKET_ROUND_GAP;
const BRACKET_HEIGHT = BRACKET_TITLE_HEIGHT + BRACKET_CARD_HEIGHT + BRACKET_CONTENT_HEIGHT;

const OFFICIAL_EVENT_ORDER: Record<string, string[]> = {
  // ESPN event IDs are mapped to the official advancement tree, not kickoff order.
  'round-of-32': [
    '760486', '760488',
    '760489', '760492',
    '760496', '760497',
    '760494', '760493',
    '760487', '760490',
    '760491', '760495',
    '760499', '760501',
    '760498', '760500'
  ],
  'round-of-16': [
    '760502', '760503',
    '760506', '760507',
    '760504', '760505',
    '760509', '760508'
  ],
  quarterfinals: ['760510', '760511', '760512', '760513'],
  semifinals: ['760514', '760515'],
  final: ['760517']
};

const KnockoutBracket: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMatches = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const scoreboard = await fetchScoreboard();
      setEvents(scoreboard.events || []);
      setError(null);
    } catch {
      setError('Không thể tải dữ liệu knock-out từ ESPN.');
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMatches(true);
    const interval = window.setInterval(() => loadMatches(false), REFRESH_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [loadMatches]);

  const actualSlotsByRound = useMemo(() => {
    return Object.fromEntries(
      ROUNDS.map((round) => [round.id, getActualSlotsForRound(events, round.id, round.matchCount)])
    ) as Record<string, Array<Event | undefined>>;
  }, [events]);

  const connectorPaths = useMemo(() => buildConnectorPaths(), []);

  if (loading) return <Loader message="Đang tải sơ đồ..." />;
  if (error) return <div className="dashboard-error">⚠️ {error}</div>;

  return (
    <div className="bracket-container fade-in">
      <p className="bracket-note">
        Dữ liệu knock-out được map theo cây đấu chính thức, không render theo thứ tự thời gian ESPN trả về. Vì vậy các đường nối luôn đi đúng nhánh thắng lên vòng sau.
      </p>

      <div className="bracket-scroll-area">
        <div
          className="bracket-board"
          style={{
            width: BRACKET_WIDTH,
            height: BRACKET_HEIGHT,
            '--bracket-card-height': `${BRACKET_CARD_HEIGHT}px`
          } as React.CSSProperties}
        >
          <svg className="bracket-connectors" width={BRACKET_WIDTH} height={BRACKET_HEIGHT} aria-hidden="true">
            {connectorPaths.map((path, index) => <path key={index} d={path} vectorEffect="non-scaling-stroke" />)}
          </svg>

          {ROUNDS.map((round, roundIndex) => (
            <h3
              key={`${round.id}-title`}
              className="round-title"
              style={{ left: roundLeft(roundIndex), width: BRACKET_ROUND_WIDTH }}
            >
              {round.title}
            </h3>
          ))}

          {ROUNDS.flatMap((round, roundIndex) => {
            const actualSlots = actualSlotsByRound[round.id] ?? [];

            return Array.from({ length: round.matchCount }).map((_, matchIndex) => {
              const match = actualSlots[matchIndex];
              const position = matchPosition(roundIndex, matchIndex);

              return (
                <div
                  className={`bracket-match-wrapper round-${roundIndex}`}
                  key={`${round.id}-${matchIndex}`}
                  style={{ left: position.x, top: position.y, width: BRACKET_ROUND_WIDTH }}
                >
                  {match ? <MatchCard match={match} /> : <PendingMatch roundIndex={roundIndex} matchIndex={matchIndex} />}
                </div>
              );
            });
          })}
        </div>
      </div>
    </div>
  );
};

function PendingMatch({ roundIndex, matchIndex }: { roundIndex: number; matchIndex: number }) {
  const previous = ROUNDS[roundIndex - 1]?.placeholder;
  const firstLabel = roundIndex === 0 ? `Cặp ${matchIndex + 1}A` : `Thắng ${previous}-${matchIndex * 2 + 1}`;
  const secondLabel = roundIndex === 0 ? `Cặp ${matchIndex + 1}B` : `Thắng ${previous}-${matchIndex * 2 + 2}`;

  return (
    <div className="mock-match-card pending">
      <div className="mock-team"><span>{firstLabel}</span></div>
      <div className="mock-divider"></div>
      <div className="mock-team"><span>{secondLabel}</span></div>
      <div className="mock-status">Chờ kết quả</div>
    </div>
  );
}

function getActualSlotsForRound(events: Event[], roundId: string, matchCount: number): Array<Event | undefined> {
  const matches = events.filter((event) => isEventInRound(event, roundId));
  const order = OFFICIAL_EVENT_ORDER[roundId];

  if (!order?.length) return matches.sort(compareEventKickoff).slice(0, matchCount);

  const slots: Array<Event | undefined> = Array.from({ length: matchCount });
  const byId = new Map(matches.map((event) => [String(event.id), event]));

  order.slice(0, matchCount).forEach((eventId, index) => {
    const event = byId.get(String(eventId));
    if (!event) return;
    slots[index] = event;
  });

  return slots;
}

function buildConnectorPaths() {
  const paths: string[] = [];

  for (let roundIndex = 0; roundIndex < ROUNDS.length - 1; roundIndex += 1) {
    const nextRound = ROUNDS[roundIndex + 1];
    const sourceX = roundLeft(roundIndex) + BRACKET_ROUND_WIDTH;
    const targetX = roundLeft(roundIndex + 1);
    const middleX = sourceX + (targetX - sourceX) / 2;

    for (let pairIndex = 0; pairIndex < nextRound.matchCount; pairIndex += 1) {
      const topY = matchCenterY(roundIndex, pairIndex * 2);
      const bottomY = matchCenterY(roundIndex, pairIndex * 2 + 1);
      const targetY = matchCenterY(roundIndex + 1, pairIndex);

      paths.push(`M ${sourceX} ${topY} H ${middleX}`);
      paths.push(`M ${sourceX} ${bottomY} H ${middleX}`);
      paths.push(`M ${middleX} ${topY} V ${bottomY}`);
      paths.push(`M ${middleX} ${targetY} H ${targetX}`);
    }
  }

  return paths;
}

function matchPosition(roundIndex: number, matchIndex: number) {
  return { x: roundLeft(roundIndex), y: matchCenterY(roundIndex, matchIndex) };
}

function roundLeft(roundIndex: number) {
  return roundIndex * (BRACKET_ROUND_WIDTH + BRACKET_ROUND_GAP);
}

function matchCenterY(roundIndex: number, matchIndex: number) {
  const matchCount = ROUNDS[roundIndex].matchCount;
  const normalizedCenter = (matchIndex + 0.5) / matchCount;
  return BRACKET_TITLE_HEIGHT + BRACKET_CARD_HEIGHT / 2 + normalizedCenter * BRACKET_CONTENT_HEIGHT;
}

function compareEventKickoff(a: Event, b: Event) {
  return Date.parse(a.date) - Date.parse(b.date) || String(a.id).localeCompare(String(b.id));
}

function isEventInRound(event: Event, roundId: string) {
  const slug = normalizeText(event.season?.slug || '');
  const name = normalizeText(`${event.name || ''} ${event.shortName || ''}`);
  const haystack = `${slug} ${name}`;
  const isQuarterFinal = includesAny(haystack, ['quarterfinal', 'quarterfinals']);
  const isSemiFinal = includesAny(haystack, ['semifinal', 'semifinals']);

  if (roundId === 'round-of-32') return includesAny(haystack, ['roundof32', 'round32', 'last32']);
  if (roundId === 'round-of-16') return includesAny(haystack, ['roundof16', 'round16', 'last16']);
  if (roundId === 'quarterfinals') return isQuarterFinal;
  if (roundId === 'semifinals') return isSemiFinal;
  if (roundId === 'final') return includesAny(haystack, ['final']) && !isQuarterFinal && !isSemiFinal && !includesAny(haystack, ['thirdplace', '3rdplace']);
  return false;
}

function includesAny(value: string, tokens: string[]) {
  return tokens.some((token) => value.includes(token));
}

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export default KnockoutBracket;
