import { useQuery } from '@tanstack/react-query';
import {
  getAdminStatsApi,
  getReactionTimeHistogramApi,
  getDailyStatsApi,
} from '../api/adminStatsApi';

export const adminStatsKeys = {
  all: ['adminStats'] as const,
  stats: () => [...adminStatsKeys.all, 'stats'] as const,
  histogram: () => [...adminStatsKeys.all, 'histogram'] as const,
  daily: (from: string, to: string) =>
    [...adminStatsKeys.all, 'daily', from, to] as const,
};

export function useAdminStatsQuery() {
  return useQuery({
    queryKey: adminStatsKeys.stats(),
    queryFn: async () => {
      const response = await getAdminStatsApi();
      return response.data;
    },
  });
}

export function useReactionTimeHistogramQuery() {
  return useQuery({
    queryKey: adminStatsKeys.histogram(),
    queryFn: async () => {
      const response = await getReactionTimeHistogramApi();
      return response.data;
    },
  });
}

export function useDailyStatsQuery(from: string, to: string) {
  return useQuery({
    queryKey: adminStatsKeys.daily(from, to),
    queryFn: async () => {
      const response = await getDailyStatsApi(from, to);
      return response.data;
    },
  });
}
