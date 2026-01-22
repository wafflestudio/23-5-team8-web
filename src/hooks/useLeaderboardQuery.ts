import {useQuery} from '@tanstack/react-query';
import {
  getLeaderboardApi,
  getWeeklyLeaderboardApi,
  getMyLeaderboardApi,
  getMyWeeklyLeaderboardApi,
} from '../api/leaderboard';

type FilterType = 'all' | 'weekly';

export const leaderboardKeys = {
  all: ['leaderboard'] as const,
  list: (filter: FilterType, limit: number) =>
    [...leaderboardKeys.all, 'list', filter, limit] as const,
  my: (filter: FilterType) => [...leaderboardKeys.all, 'my', filter] as const,
};

export function useLeaderboardQuery(filter: FilterType, limit: number) {
  return useQuery({
    queryKey: leaderboardKeys.list(filter, limit),
    queryFn: async () => {
      const response =
        filter === 'all' ? await getLeaderboardApi(limit) : await getWeeklyLeaderboardApi(limit);
      return response.data;
    },
  });
}

export function useMyLeaderboardQuery(filter: FilterType, enabled = true) {
  return useQuery({
    queryKey: leaderboardKeys.my(filter),
    queryFn: async () => {
      const response =
        filter === 'all' ? await getMyLeaderboardApi() : await getMyWeeklyLeaderboardApi();
      return response.data;
    },
    enabled,
    retry: false,
  });
}
