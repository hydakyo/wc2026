import type { ESPNScoreboardResponse, ESPNStandingsResponse, ESPNStatsResponse } from "../types/espn";

const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world";
const ESPN_V2_BASE = "https://site.api.espn.com/apis/v2/sports/soccer/fifa.world";
const SCOREBOARD_LOOKBACK_DAYS = 2;
const SCOREBOARD_LOOKAHEAD_DAYS = 10;

const compactDate = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}${month}${day}`;
};

const addDays = (date: Date, days: number): Date => {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};

const noStoreUrl = (url: string): string => {
  const parsed = new URL(url);
  parsed.searchParams.set("_", String(Date.now()));
  return parsed.toString();
};

export const fetchScoreboard = async (): Promise<ESPNScoreboardResponse> => {
  try {
    const today = new Date();
    const dates = `${compactDate(addDays(today, -SCOREBOARD_LOOKBACK_DAYS))}-${compactDate(addDays(today, SCOREBOARD_LOOKAHEAD_DAYS))}`;
    const response = await fetch(noStoreUrl(`${ESPN_BASE}/scoreboard?dates=${dates}&limit=300`), { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching scoreboard data:", error);
    throw error;
  }
};

export const fetchStandings = async (): Promise<ESPNStandingsResponse> => {
  try {
    const response = await fetch(noStoreUrl(`${ESPN_V2_BASE}/standings`), { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching standings:", error);
    throw error;
  }
};

export const fetchStatistics = async (): Promise<ESPNStatsResponse> => {
  try {
    const response = await fetch(noStoreUrl(`${ESPN_BASE}/statistics`), { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
};
