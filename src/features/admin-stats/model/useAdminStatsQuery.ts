import { useQuery } from '@tanstack/react-query';
import { getAdminStatsApi } from '../api/adminStatsApi';

export const adminStatsKeys = {
  all: ['adminStats'] as const,
  stats: () => [...adminStatsKeys.all, 'stats'] as const,
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
