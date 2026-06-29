import {
  getTournamentData,
  type TournamentData,
  groupsForData,
  tableForData,
  thirdPlaceRankingForData,
  qualifiedTeamsForData,
  tournamentSummaryForData,
  analyticsForData,
  teamAnalyticsForData
} from './live-data';

export async function getProductionTournamentData(): Promise<TournamentData> {
  const data = await getTournamentData();
  if (data.source.provider !== 'mock') return data;

  if (process.env.REALTIME_ALLOW_MOCK === 'true') return data;

  return {
    teams: [],
    matches: [],
    standings: [],
    bracket: [],
    source: {
      ...data.source,
      label: 'Provider không khả dụng',
      configured: false,
      realtime: false,
      warning: 'Không lấy được dữ liệu thật từ provider. Production mode không hiển thị mock như dữ liệu chính thức. Có thể bật REALTIME_ALLOW_MOCK=true nếu chỉ muốn demo.'
    }
  };
}

export {
  groupsForData,
  tableForData,
  thirdPlaceRankingForData,
  qualifiedTeamsForData,
  tournamentSummaryForData,
  analyticsForData,
  teamAnalyticsForData
};
export type { TournamentData };
