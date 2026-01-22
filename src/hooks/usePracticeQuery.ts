import {useQuery} from '@tanstack/react-query';
import {getPracticeResultApi} from '../api/registration';

export const practiceKeys = {
  all: ['practice'] as const,
  result: (practiceLogId: number) => [...practiceKeys.all, 'result', practiceLogId] as const,
};

export function usePracticeResultQuery(practiceLogId: number | null, enabled = true) {
  return useQuery({
    queryKey: practiceKeys.result(practiceLogId ?? 0),
    queryFn: async () => {
      if (!practiceLogId) throw new Error('No practice log ID');
      const response = await getPracticeResultApi(practiceLogId);
      return response.data;
    },
    enabled: enabled && practiceLogId !== null,
    retry: false,
  });
}
