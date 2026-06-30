"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { standings as fallbackStandings, teams as fallbackTeams } from '@/lib/worldcup-data';
import { fetchScoreboard, fetchStandings } from '../../utils/api';
import type { ESPNStandingsResponse, Event, StatValue, StandingsEntry, Team } from '../../types/espn';
import { translateTeamName } from '../../utils/translations';
import MatchCard from './MatchCard';
import Loader from './Loader';
import '../../styles/KnockoutBracket.css';

const REFRESH_INTERVAL_MS = 30000;

type BracketEntrant = {
  label: string;
  logo?: string;
  flag?: string;
};

type TeamSeed = {
  team: BracketEntrant;
  group: string;
  points: number;
  goalDifference: number;
  goalsFor: number;
};

type ProjectedSlot = {
  isReal: false;
  home: BracketEntrant;
  away: BracketEntrant;
  status: 'Dự phóng' | 'Chờ kết quả';
};

type RealSlot = {
  isReal: true;
  data: Event;
};

type BracketSlot = ProjectedSlot | RealSlot;

type RoundConfig = {
  id: string;
  title: string;
  matchCount: number;
};

const ROUNDS: RoundConfig[] = [
  { id: 'round-of-32', title: 'Vòng 32 đội', matchCount: 16 },
  { id: 'round-of-16', title: 'Vòng 16 đội', matchCount: 8 },
  { id: 'quarterfinals', title: 'Tứ kết', matchCount: 4 },
  { id: 'semifinals', title: 'Bán kết', matchCount: 2 },
  { id: 'final', title: 'Chung kết', matchCount: 1 }
];

const KnockoutBracket: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [standings, setStandings] = useState<ESPNStandingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMatches = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const [scoreboardResponse, standingsResponse] = await Promise.allSettled([
        fetchScoreboard(),
        fetchStandings()
      ]);

      if (scoreboardResponse.status === 'fulfilled') {
        setEvents(scoreboardResponse.value.events || []);
      }
      if (standingsResponse.status === 'fulfilled') {
        setStandings(standingsResponse.value);
      }
      if (scoreboardResponse.status === 'rejected' && standingsResponse.status === 'rejected') {
        setError('Không thể tải dữ liệu từ ESPN.');
      } else {
        setError(null);
      }
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMatches(true);
    const interval = window.setInterval(() => loadMatches(false), REFRESH_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [loadMatches]);

  const projectedRounds = useMemo(() => buildProjectedRounds(standings), [standings]);

  if (loading) return <Loader message="Đang tải sơ đồ..." />;
  if (error) return <div className="dashboard-error">⚠️ {error}</div>;

  const getMatchesForRound = (roundId: string) => {
    return events.filter((event) => isEventInRound(event, roundId));
  };

  return (
    <div className="bracket-container fade-in">
      <p className="bracket-note">
        Lưu ý: ESPN public scoreboard chưa luôn trả dữ liệu vòng loại trực tiếp. Những ô có nhãn <b>Dự phóng</b> được dựng từ bảng xếp hạng hiện có; khi ESPN có fixture chính thức, hệ thống sẽ ưu tiên dữ liệu ESPN.
      </p>

      <div className="bracket-scroll-area">
        <div className="bracket-stages">
          {ROUNDS.map((round, roundIndex) => {
            const actualMatches = getMatchesForRound(round.id);
            const projectedSlots = projectedRounds[round.id] ?? [];
            const slots: BracketSlot[] = Array.from({ length: round.matchCount }).map((_, idx) => {
              if (actualMatches[idx]) return { isReal: true, data: actualMatches[idx] };
              return projectedSlots[idx] ?? makePendingSlot(idx + 1);
            });

            return (
              <div key={round.id} className="bracket-round">
                <h3 className="round-title">{round.title}</h3>
                <div className="round-matches">
                  {slots.map((slot, idx) => (
                    <div className={`bracket-match-wrapper round-${roundIndex}`} key={`${round.id}-${idx}`}>
                      {slot.isReal ? (
                        <MatchCard match={slot.data} />
                      ) : (
                        <div className={`mock-match-card ${slot.status === 'Dự phóng' ? 'projected' : 'pending'}`}>
                          <ProjectedTeam entrant={slot.home} />
                          <div className="mock-divider"></div>
                          <ProjectedTeam entrant={slot.away} />
                          <div className="mock-status">{slot.status}</div>
                        </div>
                      )}
                      {roundIndex < ROUNDS.length - 1 && (
                        <div className={`connector-line connector-${idx % 2 === 0 ? 'top' : 'bottom'}`}></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function ProjectedTeam({ entrant }: { entrant: BracketEntrant }) {
  return (
    <div className="mock-team">
      {entrant.logo ? (
        <img src={entrant.logo} alt="" className="mock-team-logo" />
      ) : entrant.flag ? (
        <span className="mock-team-flag" aria-hidden="true">{entrant.flag}</span>
      ) : null}
      <span>{entrant.label}</span>
    </div>
  );
}

function buildProjectedRounds(standings: ESPNStandingsResponse | null): Record<string, ProjectedSlot[]> {
  const seedsFromEspn = standingsToSeeds(standings);
  const seeds = seedsFromEspn.length >= 32 ? seedsFromEspn : fallbackSeeds();

  return {
    'round-of-32': buildRoundOf32(seeds),
    'round-of-16': placeholderRound(8, 'R32'),
    quarterfinals: placeholderRound(4, 'R16'),
    semifinals: placeholderRound(2, 'QF'),
    final: [{ isReal: false, home: textEntrant('Thắng SF-1'), away: textEntrant('Thắng SF-2'), status: 'Chờ kết quả' }]
  };
}

function standingsToSeeds(data: ESPNStandingsResponse | null): TeamSeed[] {
  if (!data?.children?.length) return [];

  const byGroup = data.children.map((group) => {
    const groupCode = extractGroupCode(group.name || group.abbreviation || group.id);
    const rows = (group.standings?.entries ?? [])
      .map((entry) => standingEntryToSeed(entry, groupCode))
      .sort(compareSeeds);

    return { group: groupCode, rows };
  }).filter((group) => group.group && group.rows.length >= 3);

  const winners = byGroup.map((group) => group.rows[0]).filter(Boolean);
  const runnersUp = byGroup.map((group) => group.rows[1]).filter(Boolean);
  const bestThird = byGroup.map((group) => group.rows[2]).filter(Boolean)
    .sort(compareSeeds)
    .slice(0, 8);

  return [...winners, ...runnersUp, ...bestThird];
}

function standingEntryToSeed(entry: StandingsEntry, group: string): TeamSeed {
  const stats = entry.stats ?? [];
  return {
    team: teamEntrantFromEspn(entry.team),
    group,
    points: statValue(stats, ['P', 'PTS', 'points']) || 0,
    goalDifference: statValue(stats, ['GD', 'goalDifference']) || 0,
    goalsFor: statValue(stats, ['GF', 'goalsFor']) || 0
  };
}

function fallbackSeeds(): TeamSeed[] {
  const groups = Array.from(new Set(fallbackStandings.map((row) => row.group))).sort();
  const tableByGroup = new Map(groups.map((group) => [group, fallbackStandings.filter((row) => row.group === group).sort(rankRows)]));
  const winners = groups.map((group) => tableByGroup.get(group)?.[0]).filter(isStandingRow).map(fallbackRowToSeed);
  const runnersUp = groups.map((group) => tableByGroup.get(group)?.[1]).filter(isStandingRow).map(fallbackRowToSeed);
  const bestThird = groups.map((group) => tableByGroup.get(group)?.[2]).filter(isStandingRow).sort(rankRows).slice(0, 8).map(fallbackRowToSeed);
  return [...winners, ...runnersUp, ...bestThird];
}

function fallbackRowToSeed(row: typeof fallbackStandings[number]): TeamSeed {
  const team = fallbackTeams.find((item) => item.code === row.team);
  return {
    team: {
      label: team?.name ?? row.team,
      flag: team?.flag
    },
    group: row.group,
    points: row.points,
    goalDifference: row.gd,
    goalsFor: row.gf
  };
}

function buildRoundOf32(seeds: TeamSeed[]): ProjectedSlot[] {
  const winners = seeds.slice(0, 12);
  const runnersUp = seeds.slice(12, 24);
  const bestThird = seeds.slice(24, 32);
  const highSeeds = [...winners, ...runnersUp.slice(0, 4)];
  const lowSeeds = [...runnersUp.slice(4), ...bestThird].reverse();

  return Array.from({ length: 16 }).map((_, index) => {
    const home = highSeeds[index];
    const away = takeOpponent(lowSeeds, home?.group);
    return {
      isReal: false,
      home: home?.team ?? textEntrant(`Hạt giống ${index + 1}`),
      away: away?.team ?? textEntrant(`Đội chờ xác định ${index + 1}`),
      status: 'Dự phóng'
    };
  });
}

function placeholderRound(count: number, previousRoundCode: string): ProjectedSlot[] {
  return Array.from({ length: count }).map((_, index) => ({
    isReal: false,
    home: textEntrant(`Thắng ${previousRoundCode}-${index * 2 + 1}`),
    away: textEntrant(`Thắng ${previousRoundCode}-${index * 2 + 2}`),
    status: 'Chờ kết quả'
  }));
}

function makePendingSlot(index: number): ProjectedSlot {
  return { isReal: false, home: textEntrant(`Đội chờ ${index}A`), away: textEntrant(`Đội chờ ${index}B`), status: 'Chờ kết quả' };
}

function takeOpponent(candidates: TeamSeed[], avoidGroup?: string): TeamSeed | undefined {
  if (!candidates.length) return undefined;
  const preferredIndex = candidates.findIndex((candidate) => candidate.group !== avoidGroup);
  const index = preferredIndex >= 0 ? preferredIndex : 0;
  return candidates.splice(index, 1)[0];
}

function rankRows(a: typeof fallbackStandings[number], b: typeof fallbackStandings[number]) {
  return b.points - a.points || b.gd - a.gd || b.gf - a.gf || a.team.localeCompare(b.team);
}

function isStandingRow(row: typeof fallbackStandings[number] | undefined): row is typeof fallbackStandings[number] {
  return row !== undefined;
}

function compareSeeds(a: TeamSeed, b: TeamSeed) {
  return b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor || a.team.label.localeCompare(b.team.label);
}

function statValue(stats: StatValue[], keys: string[]) {
  const normalizedKeys = keys.map(normalizeText);
  const stat = stats.find((item) => {
    const candidates = [item.abbreviation, item.name, item.displayName, item.shortDisplayName].map(normalizeText);
    return candidates.some((candidate) => normalizedKeys.includes(candidate));
  });
  return Number(stat?.value ?? stat?.displayValue ?? 0);
}

function teamEntrantFromEspn(team: Team): BracketEntrant {
  const fallback = fallbackTeams.find((item) => item.code === team.abbreviation);
  const rawName = team.shortDisplayName || team.displayName || team.name || team.abbreviation;
  return {
    label: translateTeamName(rawName),
    logo: team.logos?.[0]?.href || team.logo,
    flag: fallback?.flag
  };
}

function textEntrant(label: string): BracketEntrant {
  return { label };
}

function extractGroupCode(value: string) {
  const match = value.match(/[A-L]$/i) ?? value.match(/GROUP\s*([A-L])/i);
  return match?.[1]?.toUpperCase() ?? value;
}

function isEventInRound(event: Event, roundId: string) {
  const slug = normalizeText(event.season?.slug || '');
  const name = normalizeText(`${event.name || ''} ${event.shortName || ''} ${event.status?.type?.description || ''}`);
  const haystack = `${slug} ${name}`;

  if (roundId === 'round-of-32') return includesAny(haystack, ['roundof32', 'round32', 'last32']);
  if (roundId === 'round-of-16') return includesAny(haystack, ['roundof16', 'round16', 'last16']);
  if (roundId === 'quarterfinals') return includesAny(haystack, ['quarterfinal', 'quarterfinals']);
  if (roundId === 'semifinals') return includesAny(haystack, ['semifinal', 'semifinals']);
  if (roundId === 'final') return includesAny(haystack, ['final']) && !includesAny(haystack, ['semifinal', 'thirdplace', '3rdplace']);
  return false;
}

function includesAny(value: string, tokens: string[]) {
  return tokens.some((token) => value.includes(token));
}

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export default KnockoutBracket;
