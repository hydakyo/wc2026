export type MatchStatus = 'LIVE' | 'HT' | 'FT' | 'SCHEDULED';

export type Team = { code: string; name: string; group: string; flag: string; fifaRank: number; confed: string };
export type Match = { id: string; stage: string; group?: string; home: string; away: string; homeScore: number | null; awayScore: number | null; status: MatchStatus; minute?: number; kickoff: string; venue: string; events?: string[] };
export type StandingRow = { group: string; team: string; played: number; won: number; drawn: number; lost: number; gf: number; ga: number; gd: number; points: number; form: string };
export type ThirdPlaceRow = StandingRow & { rank: number; status: string };

export const teams: Team[] = [
  team('MEX','Mexico','A','🇲🇽',14,'CONCACAF'), team('RSA','Nam Phi','A','🇿🇦',59,'CAF'), team('KOR','H\u00e0n Qu\u1ed1c','A','🇰🇷',23,'AFC'), team('CZE','C\u1ed9ng h\u00f2a S\u00e9c','A','🇨🇿',36,'UEFA'),
  team('SUI','Th\u1ee5y S\u0129','B','🇨🇭',19,'UEFA'), team('CAN','Canada','B','🇨🇦',31,'CONCACAF'), team('BIH','Bosnia v\u00e0 Herzegovina','B','🇧🇦',70,'UEFA'), team('QAT','Qatar','B','🇶🇦',58,'AFC'),
  team('BRA','Brazil','C','🇧🇷',5,'CONMEBOL'), team('MAR','Ma R\u1ed1c','C','🇲🇦',12,'CAF'), team('SCO','Scotland','C','🏴󠁧󠁢󠁳󠁣󠁴󠁿',39,'UEFA'), team('HTI','Haiti','C','🇭🇹',83,'CONCACAF'),
  team('USA','Hoa K\u1ef3','D','🇺🇸',13,'CONCACAF'), team('AUS','\u00dac','D','🇦🇺',24,'AFC'), team('PAR','Paraguay','D','🇵🇾',48,'CONMEBOL'), team('TUR','Th\u1ed5 Nh\u0129 K\u1ef3','D','🇹🇷',28,'UEFA'),
  team('ECU','Ecuador','E','🇪🇨',32,'CONMEBOL'), team('GER','\u0110\u1ee9c','E','🇩🇪',10,'UEFA'), team('CIV','B\u1edd Bi\u1ec3n Ng\u00e0','E','🇨🇮',46,'CAF'), team('CUW','Cura\u00e7ao','E','🇨🇼',88,'CONCACAF'),
  team('NED','H\u00e0 Lan','F','🇳🇱',7,'UEFA'), team('JPN','Nh\u1eadt B\u1ea3n','F','🇯🇵',18,'AFC'), team('SWE','Th\u1ee5y \u0110i\u1ec3n','F','🇸🇪',29,'UEFA'), team('TUN','Tunisia','F','🇹🇳',41,'CAF'),
  team('BEL','B\u1ec9','G','🇧🇪',8,'UEFA'), team('EGY','Ai C\u1eadp','G','🇪🇬',33,'CAF'), team('IRI','Iran','G','🇮🇷',20,'AFC'), team('NZL','New Zealand','G','🇳🇿',91,'OFC'),
  team('ESP','T\u00e2y Ban Nha','H','🇪🇸',3,'UEFA'), team('URU','Uruguay','H','🇺🇾',11,'CONMEBOL'), team('CPV','Cape Verde','H','🇨🇻',65,'CAF'), team('KSA','\u1ea2 R\u1eadp X\u00ea \u00dat','H','🇸🇦',56,'AFC'),
  team('FRA','Ph\u00e1p','I','🇫🇷',2,'UEFA'), team('NOR','Na Uy','I','🇳🇴',37,'UEFA'), team('SEN','Senegal','I','🇸🇳',21,'CAF'), team('IRQ','Iraq','I','🇮🇶',57,'AFC'),
  team('ARG','Argentina','J','🇦🇷',1,'CONMEBOL'), team('AUT','\u00c1o','J','🇦🇹',22,'UEFA'), team('DZA','Algeria','J','🇩🇿',44,'CAF'), team('JOR','Jordan','J','🇯🇴',63,'AFC'),
  team('POR','B\u1ed3 \u0110\u00e0o Nha','K','🇵🇹',6,'UEFA'), team('COL','Colombia','K','🇨🇴',9,'CONMEBOL'), team('COD','CHDC Congo','K','🇨🇩',61,'CAF'), team('UZB','Uzbekistan','K','🇺🇿',54,'AFC'),
  team('ENG','Anh','L','🏴',4,'UEFA'), team('GHA','Ghana','L','🇬🇭',49,'CAF'), team('CRO','Croatia','L','🇭🇷',17,'UEFA'), team('PAN','Panama','L','🇵🇦',52,'CONCACAF')
];

function team(code: string, name: string, group: string, flag: string, fifaRank: number, confed: string): Team { return { code, name, group, flag, fifaRank, confed }; }

export const matches: Match[] = [
  match('m1','Group','A','MEX','RSA',2,0,'FT','2026-06-11T19:00:00Z','Mexico City'), match('m2','Group','A','KOR','CZE',2,1,'FT','2026-06-12T02:00:00Z','Guadalajara'), match('m3','Group','B','CAN','BIH',1,1,'FT','2026-06-12T19:00:00Z','Toronto'), match('m4','Group','C','BRA','MAR',1,1,'FT','2026-06-13T22:00:00Z','Miami'), match('m5','Group','D','USA','PAR',4,1,'FT','2026-06-13T01:00:00Z','Los Angeles'),
  { ...match('live1','Group','K','COL','POR',1,1,'LIVE','2026-06-27T23:30:00Z','Dallas'), minute: 67, events: ['12\' Diaz ghi b\u00e0n','44\' Fernandes ghi b\u00e0n penalty','61\' B\u1ed3 \u0110\u00e0o Nha nh\u1eadn th\u1ebb v\u00e0ng'] },
  { ...match('live2','Group','L','CRO','GHA',0,1,'LIVE','2026-06-27T21:00:00Z','Atlanta'), minute: 52, events: ['38\' Kudus ghi b\u00e0n','49\' Croatia t\u0103ng \u00e1p l\u1ef1c'] },
  match('u1','Group','J','ARG','JOR',null,null,'SCHEDULED','2026-06-28T02:00:00Z','New York/New Jersey'), match('u2','Round of 32',undefined,'RSA','CAN',null,null,'SCHEDULED','2026-06-28T19:00:00Z','Vancouver'), match('u3','Round of 32',undefined,'BRA','JPN',null,null,'SCHEDULED','2026-06-29T17:00:00Z','Houston'), match('u4','Round of 32',undefined,'NED','MAR',null,null,'SCHEDULED','2026-06-30T01:00:00Z','Atlanta')
];

function match(id: string, stage: string, group: string | undefined, home: string, away: string, homeScore: number | null, awayScore: number | null, status: MatchStatus, kickoff: string, venue: string): Match { return { id, stage, group, home, away, homeScore, awayScore, status, kickoff, venue }; }

export const standings: StandingRow[] = [
  row('A','MEX',3,3,0,0,6,0,'WWW'), row('A','RSA',3,1,1,1,2,3,'LDW'), row('A','KOR',3,1,0,2,2,4,'WLL'), row('A','CZE',3,0,1,2,2,5,'LDL'), row('B','SUI',3,2,1,0,7,3,'WDW'), row('B','CAN',3,1,1,1,8,3,'WDL'), row('B','BIH',3,1,1,1,5,6,'DLW'), row('B','QAT',3,0,1,2,2,11,'DLL'),
  row('C','BRA',3,2,1,0,7,1,'DWW'), row('C','MAR',3,2,1,0,6,3,'DWW'), row('C','SCO',3,1,0,2,1,4,'WLL'), row('C','HTI',3,0,0,3,2,8,'LLL'), row('D','USA',3,2,0,1,8,4,'WWL'), row('D','AUS',3,1,1,1,2,2,'WLD'), row('D','PAR',3,1,1,1,2,4,'LWD'), row('D','TUR',3,1,0,2,3,5,'LLW'),
  row('E','ECU',3,2,1,0,3,1,'WDW'), row('E','GER',3,2,0,1,10,4,'WWL'), row('E','CIV',3,2,0,1,4,2,'WLW'), row('E','CUW',3,0,1,2,1,9,'LDL'), row('F','NED',3,2,1,0,10,4,'DWW'), row('F','JPN',3,1,2,0,7,3,'DWD'), row('F','SWE',3,1,1,1,7,7,'WLD'), row('F','TUN',3,0,0,3,2,12,'LLL'),
  row('G','BEL',3,1,2,0,6,2,'DDW'), row('G','EGY',3,1,2,0,5,3,'DWD'), row('G','IRI',3,0,3,0,3,3,'DDD'), row('G','NZL',3,0,1,2,4,10,'DLL'), row('H','ESP',3,2,1,0,5,0,'DWW'), row('H','URU',3,0,2,1,3,4,'DDL'), row('H','CPV',3,0,3,0,2,2,'DDD'), row('H','KSA',3,0,2,1,1,5,'DLD'),
  row('I','FRA',3,3,0,0,10,2,'WWW'), row('I','NOR',3,2,0,1,8,6,'WWL'), row('I','SEN',3,1,0,2,8,6,'LLW'), row('I','IRQ',3,0,0,3,1,12,'LLL'), row('J','ARG',2,2,0,0,5,0,'WW'), row('J','AUT',2,1,0,1,3,3,'WL'), row('J','DZA',2,1,0,1,2,4,'LW'), row('J','JOR',2,0,0,2,2,5,'LL'),
  row('K','POR',2,1,1,0,6,1,'DW'), row('K','COL',2,2,0,0,4,1,'WW'), row('K','COD',2,0,1,1,1,2,'DL'), row('K','UZB',2,0,0,2,1,8,'LL'), row('L','ENG',2,1,1,0,4,2,'WD'), row('L','GHA',2,1,1,0,1,0,'WD'), row('L','CRO',2,1,0,1,3,4,'LW'), row('L','PAN',2,0,0,2,0,2,'LL')
];

function row(group: string, team: string, played: number, won: number, drawn: number, lost: number, gf: number, ga: number, form: string): StandingRow { return { group, team, played, won, drawn, lost, gf, ga, gd: gf - ga, points: won * 3 + drawn, form }; }
export const groups = Array.from(new Set(standings.map((item) => item.group)));
export function rankSort(a: StandingRow, b: StandingRow) { return b.points - a.points || b.gd - a.gd || b.gf - a.gf || a.team.localeCompare(b.team); }
export function tableFor(group: string) { return standings.filter((row) => row.group === group).sort(rankSort); }
export function thirdPlaceRanking(): ThirdPlaceRow[] { return groups.map((group) => tableFor(group)[2]).filter(Boolean).sort(rankSort).map((team, index) => ({ ...team, rank: index + 1, status: index < 8 ? 'V\u00f9ng \u0111i ti\u1ebfp' : 'Nguy c\u01a1 b\u1ecb lo\u1ea1i' })); }
export function qualifiedTeams() { return { winners: groups.map((group) => tableFor(group)[0]), runnersUp: groups.map((group) => tableFor(group)[1]), bestThird: thirdPlaceRanking().slice(0, 8) }; }
export function teamName(code: string) { return teams.find((team) => team.code === code)?.name ?? code; }
export function teamLabel(code: string, includeCode = true) { const t = teams.find((team) => team.code === code); if (!t) return code; return `${t.flag} ${includeCode ? `${t.code} · ` : ''}${t.name}`; }
export function formatKickoff(value: string) { return new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', dateStyle: 'short', timeStyle: 'short' }).format(new Date(value)); }
export function statusLabel(status: string) { return ({ LIVE: '\u0110ang \u0111\u00e1', HT: 'Ngh\u1ec9 gi\u1eefa hi\u1ec7p', FT: '\u0110\u00e3 k\u1ebft th\u00fac', SCHEDULED: 'S\u1eafp \u0111\u00e1' } as Record<string, string>)[status] ?? status; }
export function stageLabel(stage: string) { return ({ Group: 'V\u00f2ng b\u1ea3ng', 'Round of 32': 'V\u00f2ng 32 \u0111\u1ed9i', 'Round of 16': 'V\u00f2ng 16 \u0111\u1ed9i', 'Quarter-final': 'T\u1ee9 k\u1ebft', 'Semi-final': 'B\u00e1n k\u1ebft', Final: 'Chung k\u1ebft' } as Record<string, string>)[stage] ?? stage; }
export function bracketStatusLabel(status: string) { return ({ 'Official slot': 'Su\u1ea5t ch\u00ednh th\u1ee9c', Projected: 'D\u1ef1 ph\u00f3ng', Pending: 'Ch\u1edd x\u00e1c \u0111\u1ecbnh' } as Record<string, string>)[status] ?? status; }

export function tournamentSummary() {
  const live = matches.filter((match) => match.status === 'LIVE'); const finished = matches.filter((match) => match.status === 'FT'); const upcoming = matches.filter((match) => match.status === 'SCHEDULED'); const q = qualifiedTeams();
  return { liveCount: live.length, goalsToday: live.reduce((sum, match) => sum + (match.homeScore ?? 0) + (match.awayScore ?? 0), 0), qualifiedCount: q.winners.length + q.runnersUp.length + q.bestThird.length, nextKickoff: upcoming[0]?.kickoff, live, finished: finished.slice(-6).reverse(), upcoming: upcoming.slice(0, 6), topAttack: [...standings].sort((a,b) => b.gf - a.gf).slice(0, 6), bestDefense: [...standings].sort((a,b) => a.ga - b.ga || b.points - a.points).slice(0, 6) };
}

export const bracket = [
  { round: 'Round of 32', left: 'RSA', right: 'CAN', status: 'Official slot' }, { round: 'Round of 32', left: 'BRA', right: 'JPN', status: 'Official slot' }, { round: 'Round of 32', left: 'GER', right: 'PAR', status: 'Projected' }, { round: 'Round of 32', left: 'NED', right: 'MAR', status: 'Official slot' }, { round: 'Round of 32', left: 'FRA', right: 'SWE', status: 'Projected' }, { round: 'Round of 32', left: 'MEX', right: 'TBD', status: 'Projected' },
  { round: 'Round of 16', left: 'Winner R32-1', right: 'Winner R32-2', status: 'Pending' }, { round: 'Quarter-final', left: 'TBD', right: 'TBD', status: 'Pending' }, { round: 'Semi-final', left: 'TBD', right: 'TBD', status: 'Pending' }, { round: 'Final', left: 'TBD', right: 'TBD', status: 'Pending' }
];

export function analytics() { const attack = [...standings].sort((a,b) => b.gf / Math.max(1,b.played) - a.gf / Math.max(1,a.played)).slice(0,6).map((row) => ({ team: row.team, value: (row.gf / Math.max(1,row.played)).toFixed(2) })); const defense = [...standings].sort((a,b) => a.ga / Math.max(1,a.played) - b.ga / Math.max(1,b.played)).slice(0,6).map((row) => ({ team: row.team, value: (row.ga / Math.max(1,row.played)).toFixed(2) })); const form = [...standings].sort(rankSort).slice(0,6).map((row) => ({ team: row.team, value: row.form })); return { attack, defense, form }; }
export function teamAnalytics() { return standings.map((s) => ({ ...s, ...(teams.find((team) => team.code === s.team) ?? { name: s.team, flag: '', fifaRank: 0, confed: '', code: s.team, group: s.group }) })).sort(rankSort); }
