import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAutoSyncStatusApi,
  runCourseSyncApi,
  enableAutoSyncApi,
  disableAutoSyncApi,
} from '../api/courseSyncApi';
import type { CourseSyncRunRequest } from './types';

export const courseSyncKeys = {
  all: ['courseSync'] as const,
  status: () => [...courseSyncKeys.all, 'status'] as const,
};

export function useAutoSyncStatusQuery() {
  return useQuery({
    queryKey: courseSyncKeys.status(),
    queryFn: async () => {
      const response = await getAutoSyncStatusApi();
      return response.data;
    },
    retry: false,
  });
}

export function useRunSyncMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CourseSyncRunRequest) => runCourseSyncApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseSyncKeys.all });
    },
  });
}

export function useToggleAutoSyncMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enable: boolean) => {
      if (enable) {
        return await enableAutoSyncApi();
      } else {
        return await disableAutoSyncApi();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseSyncKeys.all });
    },
  });
}
