import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {
  getLeaderboardApi,
  getWeeklyLeaderboardApi,
  getMyLeaderboardApi,
  getMyWeeklyLeaderboardApi,
} from '../api/leaderboard';
import type {LeaderboardResponse, LeaderboardCategoryResponse} from '../types/apiTypes';

type FilterType = 'all' | 'weekly';
type CategoryType = 'firstReaction' | 'secondReaction' | 'competitionRate';

const PAGE_SIZE = 5;

export const leaderboardKeys = {
  all: ['leaderboard'] as const,
  list: (filter: FilterType, category: CategoryType) =>
    [...leaderboardKeys.all, 'list', filter, category] as const,
  my: (filter: FilterType) => [...leaderboardKeys.all, 'my', filter] as const,
};

const getCategoryData = (data: LeaderboardResponse, category: CategoryType): LeaderboardCategoryResponse => {
  switch (category) {
    case 'firstReaction':
      return data.topFirstReactionTime;
    case 'secondReaction':
      return data.topSecondReactionTime;
    case 'competitionRate':
      return data.topCompetitionRate;
  }
};

export function useLeaderboardInfiniteQuery(filter: FilterType, category: CategoryType) {
  return useInfiniteQuery({
    queryKey: leaderboardKeys.list(filter, category),
    queryFn: async ({pageParam = 0}) => {
      const response =
        filter === 'all'
          ? await getLeaderboardApi({page: pageParam, size: PAGE_SIZE})
          : await getWeeklyLeaderboardApi({page: pageParam, size: PAGE_SIZE});
      return {
        fullData: response.data,
        categoryData: getCategoryData(response.data, category),
        page: pageParam,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const {pageInfo} = lastPage.categoryData;
      return pageInfo.hasNext ? pageInfo.page + 1 : undefined;
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
