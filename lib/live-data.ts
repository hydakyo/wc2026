import {
  bracket as mockBracket,
  matches as mockMatches,
  standings as mockStandings,
  teams as mockTeams,
  type Match,
  type MatchStatus,
  type StandingRow,
  type Team
} from './worldcup-data';

export type DataSourceInfo = {
  provider: 'mock' | 'football-data' | 'espn';
  label: string;
  configured: boolean;
  realtime: boolean;
  updatedAt: string;
  warning?: string;
};

export type TournamentData = {
  teams: Team[];
  matches: Match[];
  standings: StandingRow[];
  bracket: typeof mockBracket;
  source: DataSourceInfo;
};

type BracketSlot = typeof mockBracket[number];
type Seed = { team: string; group: string };

type FootballDataTeam = {
  id?: number;
  name?: string;
  shortName?: string;
  tla?: string;
  crest?: string;
  area?: { name?: string; code?: string };
};

type FootballDataMatch = {
  id?: number;
  utcDate?: string;
  status?: string;
  stage?: string;
  group?: string | null;
  homeTeam?: FootballDataTeam;
  awayTeam?: FootballDataTeam;
  score?: {
    winner?: string | null;
    fullTime?: { home?: number | null; away?: number | null };
    regularTime?: { home?: number | null; away?: number | null };
    halfTime?: { home?: number | null; away?: number | null };
  };
};

type EspnTeam = {
  id?: string;
  abbreviation?: string;
  displayName?: string;
  shortDisplayName?: string;
  name?: string;
  location?: string;
  logo?: string;
};

type EspnCompetitor = {
  homeAway?: 'home' | 'away';
  score?: string;
  winner?: boolean;
  advance?: boolean;
  team?: EspnTeam;
};

type EspnCompetition = {
  date?: string;
  startDate?: string;
  competitors?: EspnCompetitor[];
  status?: { displayClock?: string; period?: number; type?: { state?: string; completed?: boolean; detail?: string; shortDetail?: string; description?: string; name?: string } };
  venue?: { fullName?: string; displayName?: string; address?: { city?: string; country?: string } };
  details?: Array<{ clock?: { displayValue?: string }; type?: { text?: string }; scoringPlay?: boolean; yellowCard?: boolean; redCard?: boolean; athletesInvolved?: Array<{ displayName?: string }> }>;
  altGameNote?: string;
};

type EspnEvent = {
  id?: string;
  date?: string;
  name?: string;
  shortName?: string;
  season?: { year?: number; slug?: string; type?: number };
  competitions?: EspnCompetition[];
};

type EspnScoreboard = {
  leagues?: Array<{ season?: { year?: number; type?: { name?: string } }; calendar?: unknown[] }>;
  events?: EspnEvent[];
};

const mockSource: DataSourceInfo = {
  provider: 'mock',
  label: 'Dữ liệu mô phỏng',
  configured: false,
  realtime: false,
  updatedAt: new Date().toISOString(),
  warning: 'Không lấy được dữ liệu từ provider thật. Website đang dùng dữ liệu mô phỏng.'
};

export async function getTournamentData(): Promise<TournamentData> {
  const provider = (process.env.REALTIME_PROVIDER ?? 'espn').toLowerCase();

  if (provider === 'football-data') {
    const token = process.env.FOOTBALL_DATA_API_KEY;
    if (!token) return getMockTournamentData('Chưa cấu hình FOOTBALL_DATA_API_KEY cho football-data.org.');
    try {
      return await getFootballDataTournament(token);
    } catch (error) {
      return getMockTournamentData(providerError('football-data.org', error));
    }
  }

  try {
    return await getEspnTournament();
  } catch (error) {
    return getMockTournamentData(providerError('ESPN scoreboard', error));
  }
}

export function getMockTournamentData(warning?: string): TournamentData {
  return {
    teams: mockTeams,
    matches: mockMatches,
    standings: mockStandings,
    bracket: mockBracket,
    source: { ...mockSource, warning: warning ?? mockSource.warning, updatedAt: new Date().toISOString() }
  };
}

function providerError(provider: string, error: unknown) {
  const message = error instanceof Error ? error.message : 'Không rõ lỗi provider';
  return `Không lấy được dữ liệu thật từ ${provider}: ${message}. Tạm dùng dữ liệu mô phỏng.`;
}

async function getEspnTournament(): Promise<TournamentData> {
  const baseUrl = process.env.ESPN_SCOREBOARD_URL ?? 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard';
  const today = new Date();
  const from = compactDate(addDays(today, -2));
  const to = compactDate(addDays(today, 10));
  const url = `${baseUrl}?dates=${from}-${to}&limit=300`;
  const payload = await fetchJson<EspnScoreboard>(url, {}, 15000);
  const matches = normalizeEspnMatches(payload.events ?? []);
  const teams = teamsFromMatches(matches);
  const standings = computeStandings(teams, matches);
  const hasProviderKnockout = hasKnockoutMatches(matches);
  const bracket = buildBracket(matches, standings);

  return {
    teams,
    matches,
    standings,
    bracket,
    source: {
      provider: 'espn',
      label: 'ESPN public scoreboard',
      configured: true,
      realtime: true,
      updatedAt: new Date().toISOString(),
      warning: matches.length
        ? hasProviderKnockout || !bracket.length
          ? undefined
          : 'ESPN chưa trả dữ liệu knock-out. Nhánh đấu đang được dự phóng từ bảng xếp hạng hiện có.'
        : 'ESPN provider chưa trả về trận trong cửa sổ ngày hiện tại.'
    }
  };
}

async function getFootballDataTournament(token: string): Promise<TournamentData> {
  const baseUrl = process.env.FOOTBALL_DATA_BASE_URL ?? 'https://api.football-data.org/v4';
  const competition = process.env.FOOTBALL_DATA_COMPETITION ?? 'WC';
  const season = process.env.FOOTBALL_DATA_SEASON ?? '2026';
  const headers = { 'X-Auth-Token': token, Accept: 'application/json' };

  const [matchesPayload, teamsPayload] = await Promise.all([
    fetchJson<{ matches?: FootballDataMatch[] }>(`${baseUrl}/competitions/${competition}/matches?season=${season}`, headers),
    fetchJson<{ teams?: FootballDataTeam[] }>(`${baseUrl}/competitions/${competition}/teams?season=${season}`, headers).catch(() => ({ teams: [] }))
  ]);

  const teams = normalizeTeams(teamsPayload.teams ?? []);
  const teamMap = new Map(teams.map((team) => [team.code, team]));
  const matches = normalizeMatches(matchesPayload.matches ?? [], teamMap);
  const standings = computeStandings(teams, matches);
  const hasProviderKnockout = hasKnockoutMatches(matches);
  const bracket = buildBracket(matches, standings);

  return {
    teams,
    matches,
    standings,
    bracket,
    source: {
      provider: 'football-data',
      label: 'football-data.org',
      configured: true,
      realtime: true,
      updatedAt: new Date().toISOString(),
      warning: matches.length
        ? hasProviderKnockout || !bracket.length
          ? undefined
          : 'Provider chưa trả dữ liệu knock-out. Nhánh đấu đang được dự phóng từ bảng xếp hạng hiện có.'
        : 'Provider đã cấu hình nhưng chưa trả về trận World Cup 2026.'
    }
  };
}

async function fetchJson<T>(url: string, headers: Record<string, string>, timeoutMs = 12000): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { headers, cache: 'no-store', signal: controller.signal, next: { revalidate: 0 } });
    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(`${response.status} ${response.statusText}${body ? ` - ${body.slice(0, 180)}` : ''}`);
    }
    return response.json() as Promise<T>;
  } finally {
    clearTimeout(timer);
  }
}

function normalizeEspnMatches(events: EspnEvent[]): Match[] {
  return events.map((event) => {
    const competition = event.competitions?.[0];
    const competitors = competition?.competitors ?? [];
    const home = competitors.find((item) => item.homeAway === 'home') ?? competitors[0];
    const away = competitors.find((item) => item.homeAway === 'away') ?? competitors[1];
    const homeCode = safeCode(home?.team?.abbreviation ?? home?.team?.shortDisplayName ?? home?.team?.displayName);
    const awayCode = safeCode(away?.team?.abbreviation ?? away?.team?.shortDisplayName ?? away?.team?.displayName);
    const stage = normalizeStage(event.season?.slug ?? competition?.altGameNote ?? event.name);
    const eventDetails = competition?.details ?? [];

    return {
      id: String(event.id ?? `${homeCode}-${awayCode}-${event.date ?? Math.random()}`),
      stage,
      group: extractGroup(competition?.altGameNote ?? event.season?.slug),
      home: homeCode,
      away: awayCode,
      homeScore: parseScore(home?.score),
      awayScore: parseScore(away?.score),
      status: mapEspnStatus(competition?.status?.type?.state, competition?.status?.type?.completed),
      minute: extractMinute(competition?.status?.displayClock),
      kickoff: competition?.date ?? competition?.startDate ?? event.date ?? new Date().toISOString(),
      venue: competition?.venue?.fullName ?? competition?.venue?.displayName ?? 'Chưa cập nhật',
      events: eventDetails.slice(-5).map((detail) => formatEspnDetail(detail)).filter(Boolean) as string[]
    };
  });
}

function teamsFromMatches(matches: Match[]): Team[] {
  const fallback = new Map(mockTeams.map((team) => [team.code, team]));
  const groups = new Map<string, string | undefined>();
  for (const match of matches) {
    if (!groups.has(match.home)) groups.set(match.home, match.group);
    if (!groups.has(match.away)) groups.set(match.away, match.group);
  }
  return Array.from(groups.entries()).map(([code, group]) => {
    const fb = fallback.get(code);
    return {
      code,
      name: fb?.name ?? code,
      group: group ?? fb?.group ?? 'TBD',
      flag: fb?.flag ?? '🏳️',
      fifaRank: fb?.fifaRank ?? 0,
      confed: fb?.confed ?? 'N/A'
    };
  });
}

function hasKnockoutMatches(matches: Match[]) {
  return matches.some((match) => match.stage !== 'Group');
}

function buildBracket(matches: Match[], standings: StandingRow[]): BracketSlot[] {
  const providerBracket = buildBracketFromMatches(matches);
  if (providerBracket.length) return providerBracket;
  return buildProjectedKnockoutBracket(standings);
}

function buildBracketFromMatches(matches: Match[]): BracketSlot[] {
  return matches
    .filter((match) => match.stage !== 'Group')
    .map((match) => ({ round: match.stage, left: match.home, right: match.away, status: match.status === 'FT' ? 'Official slot' : 'Projected' }));
}

function buildProjectedKnockoutBracket(standings: StandingRow[]): BracketSlot[] {
  const groups = Array.from(new Set(standings.map((item) => item.group))).filter(Boolean).sort();
  if (!groups.length) return [];

  const tableByGroup = new Map(groups.map((group) => [group, standings.filter((row) => row.group === group).sort(rankSort)]));
  const winners = groups.map((group) => tableByGroup.get(group)?.[0]).filter(isStandingRow).map(toSeed);
  const runnersUp = groups.map((group) => tableByGroup.get(group)?.[1]).filter(isStandingRow).map(toSeed);
  const bestThird = groups
    .map((group) => tableByGroup.get(group)?.[2])
    .filter(isStandingRow)
    .sort(rankSort)
    .slice(0, 8)
    .map(toSeed);

  const qualifiers = [...winners, ...runnersUp, ...bestThird];
  if (qualifiers.length < 2) return [];

  const highSeeds = [...winners, ...runnersUp.slice(0, Math.max(0, 16 - winners.length))];
  const lowSeeds = [...runnersUp.slice(Math.max(0, 16 - winners.length)), ...bestThird].reverse();
  const roundOf32: BracketSlot[] = [];

  for (let index = 0; index < 16; index += 1) {
    const left = highSeeds[index];
    const right = takeOpponent(lowSeeds, left?.group);
    roundOf32.push({
      round: 'Round of 32',
      left: left?.team ?? 'TBD',
      right: right?.team ?? 'TBD',
      status: left && right ? 'Projected' : 'Pending'
    });
  }

  return [
    ...roundOf32,
    ...placeholderRound('Round of 16', 8, 'R32'),
    ...placeholderRound('Quarter-final', 4, 'R16'),
    ...placeholderRound('Semi-final', 2, 'QF'),
    { round: 'Final', left: 'Winner SF-1', right: 'Winner SF-2', status: 'Pending' }
  ];
}

function isStandingRow(row: StandingRow | undefined): row is StandingRow {
  return row !== undefined;
}

function toSeed(row: StandingRow): Seed {
  return { team: row.team, group: row.group };
}

function takeOpponent(candidates: Seed[], avoidGroup?: string): Seed | undefined {
  if (!candidates.length) return undefined;
  const preferredIndex = candidates.findIndex((candidate) => candidate.group !== avoidGroup);
  const index = preferredIndex >= 0 ? preferredIndex : 0;
  return candidates.splice(index, 1)[0];
}

function placeholderRound(round: string, count: number, previousRoundCode: string): BracketSlot[] {
  return Array.from({ length: count }, (_, index) => ({
    round,
    left: `Winner ${previousRoundCode}-${index * 2 + 1}`,
    right: `Winner ${previousRoundCode}-${index * 2 + 2}`,
    status: 'Pending'
  }));
}

function normalizeTeams(items: FootballDataTeam[]): Team[] {
  const fallback = new Map(mockTeams.map((team) => [team.code, team]));
  const teams = items.map((item) => {
    const code = safeCode(item.tla ?? item.area?.code ?? item.shortName ?? item.name);
    const fb = fallback.get(code);
    return { code, name: item.shortName ?? item.name ?? fb?.name ?? code, group: fb?.group ?? 'TBD', flag: fb?.flag ?? '🏳️', fifaRank: fb?.fifaRank ?? 0, confed: fb?.confed ?? item.area?.name ?? 'N/A' };
  }).filter((team) => team.code !== 'TBD');
  return teams.length ? teams : mockTeams;
}

function normalizeMatches(items: FootballDataMatch[], teamMap: Map<string, Team>): Match[] {
  return items.map((item) => {
    const home = safeCode(item.homeTeam?.tla ?? item.homeTeam?.shortName ?? item.homeTeam?.name);
    const away = safeCode(item.awayTeam?.tla ?? item.awayTeam?.shortName ?? item.awayTeam?.name);
    const score = item.score?.fullTime ?? item.score?.regularTime ?? item.score?.halfTime;
    const group = extractGroup(item.group) ?? teamMap.get(home)?.group;
    return { id: String(item.id ?? `${home}-${away}-${item.utcDate ?? Math.random()}`), stage: normalizeStage(item.stage), group, home, away, homeScore: score?.home ?? null, awayScore: score?.away ?? null, status: mapFootballDataStatus(item.status), kickoff: item.utcDate ?? new Date().toISOString(), venue: 'Chưa cập nhật' };
  });
}

function computeStandings(teams: Team[], matches: Match[]): StandingRow[] {
  const rows = new Map<string, StandingRow>();
  for (const team of teams) if (team.group && team.group !== 'TBD') rows.set(team.code, row(team.group, team.code));
  for (const match of matches) {
    if (!match.group || match.homeScore === null || match.awayScore === null) continue;
    if (!['FT', 'LIVE', 'HT'].includes(match.status)) continue;
    const home = ensureRow(rows, match.group, match.home);
    const away = ensureRow(rows, match.group, match.away);
    home.played += 1; away.played += 1;
    home.gf += match.homeScore; home.ga += match.awayScore;
    away.gf += match.awayScore; away.ga += match.homeScore;
    if (match.homeScore > match.awayScore) { home.won += 1; home.points += 3; away.lost += 1; }
    else if (match.homeScore < match.awayScore) { away.won += 1; away.points += 3; home.lost += 1; }
    else { home.drawn += 1; away.drawn += 1; home.points += 1; away.points += 1; }
    home.gd = home.gf - home.ga; away.gd = away.gf - away.ga;
  }
  return Array.from(rows.values()).map((item) => ({ ...item, gd: item.gf - item.ga }));
}

function row(group: string, team: string): StandingRow { return { group, team, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0, form: '-' }; }
function ensureRow(rows: Map<string, StandingRow>, group: string, team: string): StandingRow { const existing = rows.get(team); if (existing) return existing; const created = row(group, team); rows.set(team, created); return created; }
function safeCode(value?: string | null): string { if (!value) return 'TBD'; return value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3) || 'TBD'; }
function parseScore(value?: string) { if (value === undefined || value === '') return null; const number = Number(value); return Number.isFinite(number) ? number : null; }
function extractMinute(clock?: string) { if (!clock) return undefined; const match = clock.match(/\d+/); return match ? Number(match[0]) : undefined; }
function formatEspnDetail(detail: NonNullable<EspnCompetition['details']>[number]) { const minute = detail.clock?.displayValue ?? ''; const label = detail.type?.text ?? ''; const athlete = detail.athletesInvolved?.[0]?.displayName ?? ''; return [minute, athlete, label].filter(Boolean).join(' · '); }
function extractGroup(group?: string | null): string | undefined { if (!group) return undefined; const match = group.match(/[A-L]$/i) ?? group.match(/GROUP_([A-L])/i); return match?.[1]?.toUpperCase(); }
function normalizeStage(stage?: string): string { if (!stage) return 'Group'; const value = stage.toUpperCase(); if (value.includes('GROUP')) return 'Group'; if (value.includes('ROUND OF 32') || value.includes('ROUND-OF-32') || value.includes('LAST_32')) return 'Round of 32'; if (value.includes('ROUND OF 16') || value.includes('RD OF 16') || value.includes('LAST_16')) return 'Round of 16'; if (value.includes('QUARTER')) return 'Quarter-final'; if (value.includes('SEMI')) return 'Semi-final'; if (value.includes('FINAL')) return 'Final'; if (value.includes('3RD')) return '3rd-Place Match'; return stage; }
function mapFootballDataStatus(status?: string): MatchStatus { if (status === 'FINISHED') return 'FT'; if (status === 'PAUSED') return 'HT'; if (['IN_PLAY', 'LIVE'].includes(status ?? '')) return 'LIVE'; return 'SCHEDULED'; }
function mapEspnStatus(state?: string, completed?: boolean): MatchStatus { if (completed || state === 'post') return 'FT'; if (state === 'in') return 'LIVE'; return 'SCHEDULED'; }
function addDays(date: Date, days: number) { const next = new Date(date); next.setUTCDate(next.getUTCDate() + days); return next; }
function compactDate(date: Date) { const y = date.getUTCFullYear(); const m = String(date.getUTCMonth() + 1).padStart(2, '0'); const d = String(date.getUTCDate()).padStart(2, '0'); return `${y}${m}${d}`; }

export function groupsForData(data: TournamentData) { return Array.from(new Set(data.standings.map((item) => item.group))).filter(Boolean).sort(); }
export function rankSort(a: StandingRow, b: StandingRow) { return b.points - a.points || b.gd - a.gd || b.gf - a.gf || a.team.localeCompare(b.team); }
export function tableForData(data: TournamentData, group: string) { return data.standings.filter((row) => row.group === group).sort(rankSort); }
export function thirdPlaceRankingForData(data: TournamentData) { return groupsForData(data).map((group) => tableForData(data, group)[2]).filter(Boolean).sort(rankSort).map((team, index) => ({ ...team, rank: index + 1, status: index < 8 ? 'Vùng đi tiếp' : 'Nguy cơ bị loại' })); }
export function qualifiedTeamsForData(data: TournamentData) { return { winners: groupsForData(data).map((group) => tableForData(data, group)[0]).filter(Boolean), runnersUp: groupsForData(data).map((group) => tableForData(data, group)[1]).filter(Boolean), bestThird: thirdPlaceRankingForData(data).slice(0, 8) }; }
export function tournamentSummaryForData(data: TournamentData) { const live = data.matches.filter((match) => match.status === 'LIVE' || match.status === 'HT'); const finished = data.matches.filter((match) => match.status === 'FT').sort((a, b) => Date.parse(b.kickoff) - Date.parse(a.kickoff)); const upcoming = data.matches.filter((match) => match.status === 'SCHEDULED').sort((a, b) => Date.parse(a.kickoff) - Date.parse(b.kickoff)); const q = qualifiedTeamsForData(data); return { liveCount: live.length, goalsToday: live.reduce((sum, match) => sum + (match.homeScore ?? 0) + (match.awayScore ?? 0), 0), qualifiedCount: q.winners.length + q.runnersUp.length + q.bestThird.length, nextKickoff: upcoming[0]?.kickoff, live, finished: finished.slice(0, 6), upcoming: upcoming.slice(0, 6), topAttack: [...data.standings].sort((a, b) => b.gf - a.gf).slice(0, 6), bestDefense: [...data.standings].sort((a, b) => a.ga - b.ga || b.points - a.points).slice(0, 6) }; }
export function analyticsForData(data: TournamentData) { const attack = [...data.standings].sort((a, b) => b.gf / Math.max(1, b.played) - a.gf / Math.max(1, a.played)).slice(0, 6).map((row) => ({ team: row.team, value: (row.gf / Math.max(1, row.played)).toFixed(2) })); const defense = [...data.standings].sort((a, b) => a.ga / Math.max(1, a.played) - b.ga / Math.max(1, b.played)).slice(0, 6).map((row) => ({ team: row.team, value: (row.ga / Math.max(1, row.played)).toFixed(2) })); const form = [...data.standings].sort(rankSort).slice(0, 6).map((row) => ({ team: row.team, value: row.form })); return { attack, defense, form }; }
export function teamAnalyticsForData(data: TournamentData) { return data.standings.map((s) => ({ ...s, ...(data.teams.find((team) => team.code === s.team) ?? { name: s.team, flag: '', fifaRank: 0, confed: '', code: s.team, group: s.group }) })).sort(rankSort); }
