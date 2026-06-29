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
  provider: 'mock' | 'football-data';
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
  matchday?: number;
  homeTeam?: FootballDataTeam;
  awayTeam?: FootballDataTeam;
  score?: {
    winner?: string | null;
    fullTime?: { home?: number | null; away?: number | null };
    regularTime?: { home?: number | null; away?: number | null };
    halfTime?: { home?: number | null; away?: number | null };
  };
};

const mockSource: DataSourceInfo = {
  provider: 'mock',
  label: 'Dữ liệu mô phỏng',
  configured: false,
  realtime: false,
  updatedAt: new Date().toISOString(),
  warning: 'Chưa cấu hình FOOTBALL_DATA_API_KEY. Website đang dùng dữ liệu mô phỏng.'
};

export async function getTournamentData(): Promise<TournamentData> {
  const token = process.env.FOOTBALL_DATA_API_KEY;
  if (!token) return getMockTournamentData();

  try {
    return await getFootballDataTournament(token);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Không rõ lỗi provider';
    return {
      ...getMockTournamentData(),
      source: {
        ...mockSource,
        warning: `Không lấy được dữ liệu thật từ football-data.org: ${message}. Tạm dùng dữ liệu mô phỏng.`
      }
    };
  }
}

export function getMockTournamentData(): TournamentData {
  return {
    teams: mockTeams,
    matches: mockMatches,
    standings: mockStandings,
    bracket: mockBracket,
    source: { ...mockSource, updatedAt: new Date().toISOString() }
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

  return {
    teams,
    matches,
    standings,
    bracket: [],
    source: {
      provider: 'football-data',
      label: 'football-data.org',
      configured: true,
      realtime: true,
      updatedAt: new Date().toISOString(),
      warning: matches.length ? undefined : 'Provider đã cấu hình nhưng chưa trả về trận World Cup 2026. Có thể mùa giải/chặng đấu chưa mở dữ liệu.'
    }
  };
}

async function fetchJson<T>(url: string, headers: Record<string, string>): Promise<T> {
  const response = await fetch(url, { headers, cache: 'no-store', next: { revalidate: 0 } });
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`${response.status} ${response.statusText}${body ? ` - ${body.slice(0, 180)}` : ''}`);
  }
  return response.json() as Promise<T>;
}

function normalizeTeams(items: FootballDataTeam[]): Team[] {
  const fallback = new Map(mockTeams.map((team) => [team.code, team]));
  const teams = items
    .map((item) => {
      const code = safeCode(item.tla ?? item.area?.code ?? item.shortName ?? item.name);
      const fb = fallback.get(code);
      return {
        code,
        name: item.shortName ?? item.name ?? fb?.name ?? code,
        group: fb?.group ?? 'TBD',
        flag: fb?.flag ?? '🏳️',
        fifaRank: fb?.fifaRank ?? 0,
        confed: fb?.confed ?? item.area?.name ?? 'N/A'
      };
    })
    .filter((team) => team.code !== 'TBD');

  return teams.length ? teams : mockTeams;
}

function normalizeMatches(items: FootballDataMatch[], teamMap: Map<string, Team>): Match[] {
  return items.map((item) => {
    const home = safeCode(item.homeTeam?.tla ?? item.homeTeam?.shortName ?? item.homeTeam?.name);
    const away = safeCode(item.awayTeam?.tla ?? item.awayTeam?.shortName ?? item.awayTeam?.name);
    const status = mapStatus(item.status);
    const score = item.score?.fullTime ?? item.score?.regularTime ?? item.score?.halfTime;
    const group = extractGroup(item.group) ?? teamMap.get(home)?.group;

    return {
      id: String(item.id ?? `${home}-${away}-${item.utcDate ?? Math.random()}`),
      stage: normalizeStage(item.stage),
      group,
      home,
      away,
      homeScore: score?.home ?? null,
      awayScore: score?.away ?? null,
      status,
      kickoff: item.utcDate ?? new Date().toISOString(),
      venue: 'Chưa cập nhật'
    };
  });
}

function computeStandings(teams: Team[], matches: Match[]): StandingRow[] {
  const rows = new Map<string, StandingRow>();

  for (const team of teams) {
    if (!team.group || team.group === 'TBD') continue;
    rows.set(team.code, row(team.group, team.code));
  }

  for (const match of matches) {
    if (!match.group || match.homeScore === null || match.awayScore === null) continue;
    if (!['FT', 'LIVE', 'HT'].includes(match.status)) continue;

    const home = ensureRow(rows, match.group, match.home);
    const away = ensureRow(rows, match.group, match.away);
    home.played += 1;
    away.played += 1;
    home.gf += match.homeScore;
    home.ga += match.awayScore;
    away.gf += match.awayScore;
    away.ga += match.homeScore;

    if (match.homeScore > match.awayScore) {
      home.won += 1; home.points += 3; away.lost += 1;
    } else if (match.homeScore < match.awayScore) {
      away.won += 1; away.points += 3; home.lost += 1;
    } else {
      home.drawn += 1; away.drawn += 1; home.points += 1; away.points += 1;
    }

    home.gd = home.gf - home.ga;
    away.gd = away.gf - away.ga;
  }

  return Array.from(rows.values()).map((item) => ({ ...item, gd: item.gf - item.ga }));
}

function row(group: string, team: string): StandingRow {
  return { group, team, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0, form: '-' };
}

function ensureRow(rows: Map<string, StandingRow>, group: string, team: string): StandingRow {
  const existing = rows.get(team);
  if (existing) return existing;
  const created = row(group, team);
  rows.set(team, created);
  return created;
}

function safeCode(value?: string | null): string {
  if (!value) return 'TBD';
  return value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3) || 'TBD';
}

function extractGroup(group?: string | null): string | undefined {
  if (!group) return undefined;
  const match = group.match(/[A-L]$/i) ?? group.match(/GROUP_([A-L])/i);
  return match?.[1]?.toUpperCase() ?? group.replace(/^GROUP_?/i, '').slice(-1).toUpperCase();
}

function normalizeStage(stage?: string): string {
  if (!stage) return 'Group';
  if (stage.startsWith('GROUP')) return 'Group';
  if (stage.includes('LAST_32')) return 'Round of 32';
  if (stage.includes('LAST_16')) return 'Round of 16';
  if (stage.includes('QUARTER')) return 'Quarter-final';
  if (stage.includes('SEMI')) return 'Semi-final';
  if (stage.includes('FINAL')) return 'Final';
  return stage;
}

function mapStatus(status?: string): MatchStatus {
  if (status === 'FINISHED') return 'FT';
  if (status === 'PAUSED') return 'HT';
  if (['IN_PLAY', 'LIVE'].includes(status ?? '')) return 'LIVE';
  return 'SCHEDULED';
}

export function groupsForData(data: TournamentData) {
  return Array.from(new Set(data.standings.map((item) => item.group))).filter(Boolean).sort();
}

export function rankSort(a: StandingRow, b: StandingRow) {
  return b.points - a.points || b.gd - a.gd || b.gf - a.gf || a.team.localeCompare(b.team);
}

export function tableForData(data: TournamentData, group: string) {
  return data.standings.filter((row) => row.group === group).sort(rankSort);
}

export function thirdPlaceRankingForData(data: TournamentData) {
  return groupsForData(data).map((group) => tableForData(data, group)[2]).filter(Boolean).sort(rankSort).map((team, index) => ({ ...team, rank: index + 1, status: index < 8 ? 'Vùng đi tiếp' : 'Nguy cơ bị loại' }));
}

export function qualifiedTeamsForData(data: TournamentData) {
  return {
    winners: groupsForData(data).map((group) => tableForData(data, group)[0]).filter(Boolean),
    runnersUp: groupsForData(data).map((group) => tableForData(data, group)[1]).filter(Boolean),
    bestThird: thirdPlaceRankingForData(data).slice(0, 8)
  };
}

export function tournamentSummaryForData(data: TournamentData) {
  const live = data.matches.filter((match) => match.status === 'LIVE' || match.status === 'HT');
  const finished = data.matches.filter((match) => match.status === 'FT').sort((a, b) => Date.parse(b.kickoff) - Date.parse(a.kickoff));
  const upcoming = data.matches.filter((match) => match.status === 'SCHEDULED').sort((a, b) => Date.parse(a.kickoff) - Date.parse(b.kickoff));
  const q = qualifiedTeamsForData(data);
  return {
    liveCount: live.length,
    goalsToday: live.reduce((sum, match) => sum + (match.homeScore ?? 0) + (match.awayScore ?? 0), 0),
    qualifiedCount: q.winners.length + q.runnersUp.length + q.bestThird.length,
    nextKickoff: upcoming[0]?.kickoff,
    live,
    finished: finished.slice(0, 6),
    upcoming: upcoming.slice(0, 6),
    topAttack: [...data.standings].sort((a, b) => b.gf - a.gf).slice(0, 6),
    bestDefense: [...data.standings].sort((a, b) => a.ga - b.ga || b.points - a.points).slice(0, 6)
  };
}

export function analyticsForData(data: TournamentData) {
  const attack = [...data.standings].sort((a, b) => b.gf / Math.max(1, b.played) - a.gf / Math.max(1, a.played)).slice(0, 6).map((row) => ({ team: row.team, value: (row.gf / Math.max(1, row.played)).toFixed(2) }));
  const defense = [...data.standings].sort((a, b) => a.ga / Math.max(1, a.played) - b.ga / Math.max(1, b.played)).slice(0, 6).map((row) => ({ team: row.team, value: (row.ga / Math.max(1, row.played)).toFixed(2) }));
  const form = [...data.standings].sort(rankSort).slice(0, 6).map((row) => ({ team: row.team, value: row.form }));
  return { attack, defense, form };
}

export function teamAnalyticsForData(data: TournamentData) {
  return data.standings.map((s) => ({ ...s, ...(data.teams.find((team) => team.code === s.team) ?? { name: s.team, flag: '', fifaRank: 0, confed: '', code: s.team, group: s.group }) })).sort(rankSort);
}
