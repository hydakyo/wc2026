import type { ESPNScoreboardResponse, ESPNStandingsResponse, ESPNStatsResponse } from "../types/espn";

const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world";
const ESPN_V2_BASE = "https://site.api.espn.com/apis/v2/sports/soccer/fifa.world";

export const fetchScoreboard = async (): Promise<ESPNScoreboardResponse> => {
  try {
    const response = await fetch(`${ESPN_BASE}/scoreboard`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching scoreboard data:", error);
    throw error;
  }
};

export const fetchStandings = async (): Promise<ESPNStandingsResponse> => {
  try {
    const response = await fetch(`${ESPN_V2_BASE}/standings`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching standings:", error);
    throw error;
  }
};

export const fetchStatistics = async (): Promise<ESPNStatsResponse> => {
  try {
    const response = await fetch(`${ESPN_BASE}/statistics`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
};
