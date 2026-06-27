export type MatchStatus = 'LIVE' | 'HT' | 'FT' | 'SCHEDULED';

export type Team = {
  code: string;
  name: string;
  group: string;
};

export type Match = {
  id: string;
  stage: string;
  group?: string;
  home: string;
  away: string;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
  minute?: number;
  kickoff: string;
  venue: string;
  events?: string[];
};

export type StandingRow = {
  group: string;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
  form: string;
};

export const teams: Team[] = [
  { code: 'MEX', name: 'Mexico', group: 'A' }, { code: 'RSA', name: 'South Africa', group: 'A' }, { code: 'KOR', name: 'South Korea', group: 'A' }, { code: 'CZE', name: 'Czechia', group: 'A' },
  { code: 'SUI', name: 'Switzerland', group: 'B' }, { code: 'CAN', name: 'Canada', group: 'B' }, { code: 'BIH', name: 'Bosnia and Herzegovina', group: 'B' }, { code: 'QAT', name: 'Qatar', group: 'B' },
  { code: 'BRA', name: 'Brazil', group: 'C' }, { code: 'MAR', name: 'Morocco', group: 'C' }, { code: 'SCO', name: 'Scotland', group: 'C' }, { code: 'HTI', name: 'Haiti', group: 'C' },
  { code: 'USA', name: 'United States', group: 'D' }, { code: 'AUS', name: 'Australia', group: 'D' }, { code: 'PAR', name: 'Paraguay', group: 'D' }, { code: 'TUR', name: 'Turkey', group: 'D' },
  { code: 'ECU', name: 'Ecuador', group: 'E' }, { code: 'GER', name: 'Germany', group: 'E' }, { code: 'CIV', name: 'Ivory Coast', group: 'E' }, { code: 'CUW', name: 'Curacao', group: 'E' },
  { code: 'NED', name: 'Netherlands', group: 'F' }, { code: 'JPN', name: 'Japan', group: 'F' }, { code: 'SWE', name: 'Sweden', group: 'F' }, { code: 'TUN', name: 'Tunisia', group: 'F' },
  { code: 'BEL', name: 'Belgium', group: 'G' }, { code: 'EGY', name: 'Egypt', group: 'G' }, { code: 'IRI', name: 'Iran', group: 'G' }, { code: 'NZL', name: 'New Zealand', group: 'G' },
  { code: 'ESP', name: 'Spain', group: 'H' }, { code: 'URU', name: 'Uruguay', group: 'H' }, { code: 'CPV', name: 'Cape Verde', group: 'H' }, { code: 'KSA', name: 'Saudi Arabia', group: 'H' },
  { code: 'FRA', name: 'France', group: 'I' }, { code: 'NOR', name: 'Norway', group: 'I' }, { code: 'SEN', name: 'Senegal', group: 'I' }, { code: 'IRQ', name: 'Iraq', group: 'I' },
  { code: 'ARG', name: 'Argentina', group: 'J' }, { code: 'AUT', name: 'Austria', group: 'J' }, { code: 'DZA', name: 'Algeria', group: 'J' }, { code: 'JOR', name: 'Jordan', group: 'J' },
  { code: 'POR', name: 'Portugal', group: 'K' }, { code: 'COL', name: 'Colombia', group: 'K' }, { code: 'COD', name: 'DR Congo', group: 'K' }, { code: 'UZB', name: 'Uzbekistan', group: 'K' },
  { code: 'ENG', name: 'England', group: 'L' }, { code: 'GHA', name: 'Ghana', group: 'L' }, { code: 'CRO', name: 'Croatia', group: 'L' }, { code: 'PAN', name: 'Panama', group: 'L' }
];

export const matches: Match[] = [
  { id: 'm1', stage: 'Group', group: 'A', home: 'MEX', away: 'RSA', homeScore: 2, awayScore: 0, status: 'FT', kickoff: '2026-06-11T19:00:00Z', venue: 'Mexico City' },
  { id: 'm2', stage: 'Group', group: 'A', home: 'KOR', away: 'CZE', homeScore: 2, awayScore: 1, status: 'FT', kickoff: '2026-06-12T02:00:00Z', venue: 'Guadalajara' },
  { id: 'm3', stage: 'Group', group: 'B', home: 'CAN', away: 'BIH', homeScore: 1, awayScore: 1, status: 'FT', kickoff: '2026-06-12T19:00:00Z', venue: 'Toronto' },
  { id: 'm4', stage: 'Group', group: 'C', home: 'BRA', away: 'MAR', homeScore: 1, awayScore: 1, status: 'FT', kickoff: '2026-06-13T22:00:00Z', venue: 'Miami' },
  { id: 'm5', stage: 'Group', group: 'D', home: 'USA', away: 'PAR', homeScore: 4, awayScore: 1, status: 'FT', kickoff: '2026-06-13T01:00:00Z', venue: 'Los Angeles' },
  { id: 'live1', stage: 'Group', group: 'K', home: 'COL', away: 'POR', homeScore: 1, awayScore: 1, status: 'LIVE', minute: 67, kickoff: '2026-06-27T23:30:00Z', venue: 'Dallas', events: ['12\' Diaz goal', '44\' Fernandes penalty', '61\' yellow card Portugal'] },
  { id: 'live2', stage: 'Group', group: 'L', home: 'CRO', away: 'GHA', homeScore: 0, awayScore: 1, status: 'LIVE', minute: 52, kickoff: '2026-06-27T21:00:00Z', venue: 'Atlanta', events: ['38\' Kudus goal'] },
  { id: 'u1', stage: 'Group', group: 'J', home: 'ARG', away: 'JOR', homeScore: null, awayScore: null, status: 'SCHEDULED', kickoff: '2026-06-28T02:00:00Z', venue: 'New York/New Jersey' },
  { id: 'u2', stage: 'Round of 32', home: 'RSA', away: 'CAN', homeScore: null, awayScore: null, status: 'SCHEDULED', kickoff: '2026-06-28T19:00:00Z', venue: 'Vancouver' },
  { id: 'u3', stage: 'Round of 32', home: 'BRA', away: 'JPN', homeScore: null, awayScore: null, status: 'SCHEDULED', kickoff: '2026-06-29T17:00:00Z', venue: 'Houston' }
];

export const standings: StandingRow[] = [
  row('A','MEX',3,3,0,0,6,0,'WWW'), row('A','RSA',3,1,1,1,2,3,'LDW'), row('A','KOR',3,1,0,2,2,4,'WLL'), row('A','CZE',3,0,1,2,2,5,'LDL'),
  row('B','SUI',3,2,1,0,7,3,'WDW'), row('B','CAN',3,1,1,1,8,3,'WDL'), row('B','BIH',3,1,1,1,5,6,'DLW'), row('B','QAT',3,0,1,2,2,11,'DLL'),
  row('C','BRA',3,2,1,0,7,1,'DWW'), row('C','MAR',3,2,1,0,6,3,'DWW'), row('C','SCO',3,1,0,2,1,4,'WLL'), row('C','HTI',3,0,0,3,2,8,'LLL'),
  row('D','USA',3,2,0,1,8,4,'WWL'), row('D','AUS',3,1,1,1,2,2,'WLD'), row('D','PAR',3,1,1,1,2,4,'LWD'), row('D','TUR',3,1,0,2,3,5,'LLW'),
  row('E','ECU',3,2,1,0,3,1,'WDW'), row('E','GER',3,2,0,1,10,4,'WWL'), row('E','CIV',3,2,0,1,4,2,'WLW'), row('E','CUW',3,0,1,2,1,9,'LDL'),
  row('F','NED',3,2,1,0,10,4,'DWW'), row('F','JPN',3,1,2,0,7,3,'DWD'), row('F','SWE',3,1,1,1,7,7,'WLD'), row('F','TUN',3,0,0,3,2,12,'LLL'),
  row('G','BEL',3,1,2,0,6,2,'DDW'), row('G','EGY',3,1,2,0,5,3,'DWD'), row('G','IRI',3,0,3,0,3,3,'DDD'), row('G','NZL',3,0,1,2,4,10,'DLL'),
  row('H','ESP',3,2,1,0,5,0,'DWW'), row('H','URU',3,0,2,1,3,4,'DDL'), row('H','CPV',3,0,3,0,2,2,'DDD'), row('H','KSA',3,0,2,1,1,5,'DLD'),
  row('I','FRA',3,3,0,0,10,2,'WWW'), row('I','NOR',3,2,0,1,8,6,'WWL'), row('I','SEN',3,1,0,2,8,6,'LLW'), row('I','IRQ',3,0,0,3,1,12,'LLL'),
  row('J','ARG',2,2,0,0,5,0,'WW'), row('J','AUT',2,1,0,1,3,3,'WL'), row('J','DZA',2,1,0,1,2,4,'LW'), row('J','JOR',2,0,0,2,2,5,'LL'),
  row('K','POR',2,1,1,0,6,1,'DW'), row('K','COL',2,2,0,0,4,1,'WW'), row('K','COD',2,0,1,1,1,2,'DL'), row('K','UZB',2,0,0,2,1,8,'LL'),
  row('L','ENG',2,1,1,0,4,2,'WD'), row('L','GHA',2,1,1,0,1,0,'WD'), row('L','CRO',2,1,0,1,3,4,'LW'), row('L','PAN',2,0,0,2,0,2,'LL')
];

function row(group: string, team: string, played: number, won: number, drawn: number, lost: number, gf: number, ga: number, form: string): StandingRow {
  return { group, team, played, won, drawn, lost, gf, ga, gd: gf - ga, points: won * 3 + drawn, form };
}

export const groups = Array.from(new Set(standings.map((item) => item.group)));

export function tableFor(group: string) {
  return standings.filter((row) => row.group === group).sort(rankSort);
}

export function rankSort(a: StandingRow, b: StandingRow) {
  return b.points - a.points || b.gd - a.gd || b.gf - a.gf || a.team.localeCompare(b.team);
}

export function thirdPlaceRanking() {
  return groups.map((group) => tableFor(group)[2]).filter(Boolean).sort(rankSort).map((team, index) => ({ ...team, rank: index + 1, status: index < 8 ? 'Qualified zone' : 'At risk' }));
}

export function qualifiedTeams() {
  return {
    winners: groups.map((group) => tableFor(group)[0]),
    runnersUp: groups.map((group) => tableFor(group)[1]),
    bestThird: thirdPlaceRanking().slice(0, 8)
  };
}

export function teamName(code: string) {
  return teams.find((team) => team.code === code)?.name ?? code;
}

export function tournamentSummary() {
  const live = matches.filter((match) => match.status === 'LIVE');
  const finished = matches.filter((match) => match.status === 'FT');
  const upcoming = matches.filter((match) => match.status === 'SCHEDULED');
  return {
    liveCount: live.length,
    goalsToday: live.reduce((sum, match) => sum + (match.homeScore ?? 0) + (match.awayScore ?? 0), 0),
    qualifiedCount: qualifiedTeams().winners.length + qualifiedTeams().runnersUp.length + qualifiedTeams().bestThird.length,
    nextKickoff: upcoming[0]?.kickoff,
    topAttack: [...standings].sort((a, b) => b.gf - a.gf).slice(0, 5),
    bestDefense: [...standings].sort((a, b) => a.ga - b.ga || b.points - a.points).slice(0, 5),
    live,
    finished: finished.slice(-5).reverse(),
    upcoming: upcoming.slice(0, 5)
  };
}

export const bracket = [
  { round: 'Round of 32', left: 'RSA', right: 'CAN', status: 'Official slot' },
  { round: 'Round of 32', left: 'BRA', right: 'JPN', status: 'Official slot' },
  { round: 'Round of 32', left: 'GER', right: 'PAR', status: 'Projected' },
  { round: 'Round of 32', left: 'NED', right: 'MAR', status: 'Official slot' },
  { round: 'Round of 32', left: 'FRA', right: 'SWE', status: 'Projected' },
  { round: 'Round of 32', left: 'MEX', right: 'TBD', status: 'Projected' },
  { round: 'Round of 16', left: 'Winner R32-1', right: 'Winner R32-2', status: 'Pending' },
  { round: 'Quarter-final', left: 'TBD', right: 'TBD', status: 'Pending' },
  { round: 'Semi-final', left: 'TBD', right: 'TBD', status: 'Pending' },
  { round: 'Final', left: 'TBD', right: 'TBD', status: 'Pending' }
];
