export interface ESPNScoreboardResponse {
  leagues: League[];
  events: Event[];
}

export interface League {
  id: string;
  name: string;
  abbreviation: string;
  season: {
    year: number;
    displayName: string;
  };
}

export interface Event {
  id: string;
  date: string;
  name: string;
  shortName: string;
  status: Status;
  competitions: Competition[];
  season: {
    type: number;
    slug: string; // e.g. round-of-32, group-stage
  };
}

export interface Status {
  clock: number;
  displayClock: string;
  type: {
    id: string;
    name: string;
    state: "pre" | "in" | "post";
    completed: boolean;
    description: string;
    detail: string;
    shortDetail: string;
  };
}

export interface Competition {
  id: string;
  date: string;
  venue: Venue;
  competitors: Competitor[];
  status: Status;
}

export interface Venue {
  id: string;
  fullName: string;
  address: {
    city: string;
    country: string;
  };
}

export interface Competitor {
  id: string;
  type: string;
  order: number;
  homeAway: "home" | "away";
  winner: boolean;
  score: string;
  team: Team;
}

export interface Team {
  id: string;
  abbreviation: string;
  displayName: string;
  shortDisplayName: string;
  name: string;
  location: string;
  color: string;
  alternateColor: string;
  logo: string;
  logos?: { href: string }[];
}

// --- STANDINGS ---
export interface ESPNStandingsResponse {
  children: StandingsGroup[];
}

export interface StandingsGroup {
  id: string;
  name: string; // e.g. Group A
  abbreviation: string;
  standings: {
    entries: StandingsEntry[];
  };
}

export interface StandingsEntry {
  team: Team;
  note?: {
    color: string;
    description: string; // e.g. Advance to Round of 32
    rank: number;
  };
  stats: StatValue[];
}

export interface StatValue {
  name: string;
  displayName: string;
  shortDisplayName: string;
  abbreviation: string;
  type: string;
  value: number;
  displayValue: string;
}

// --- STATISTICS ---
export interface ESPNStatsResponse {
  stats: CategoryStat[];
}

export interface CategoryStat {
  name: string; // e.g. goalsLeaders
  displayName: string; // e.g. Goals
  shortDisplayName: string;
  abbreviation: string;
  leaders: Leader[];
}

export interface Leader {
  displayValue: string; // e.g. Matches: 3, Goals: 6
  value: number; // e.g. 6
  athlete: Athlete;
}

export interface Athlete {
  id: string;
  displayName: string;
  shortName: string;
  headshot?: { href: string; alt: string };
  jersey?: string;
  team: Team;
  statistics?: StatValue[];
}

