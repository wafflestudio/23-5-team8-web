import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNoticesApi,
  getNoticeDetailApi,
  createNoticeApi,
  updateNoticeApi,
  deleteNoticeApi,
} from '../api/noticeApi';
import type { NoticeCreateRequest, NoticeUpdateRequest } from './types';

export const noticeKeys = {
  all: ['notices'] as const,
  list: (page: number, size: number) => [...noticeKeys.all, 'list', page, size] as const,
  detail: (id: number) => [...noticeKeys.all, 'detail', id] as const,
};

export function useNoticesQuery(page: number, size: number) {
  return useQuery({
    queryKey: noticeKeys.list(page, size),
    queryFn: async () => {
      const response = await getNoticesApi(page, size);
      return response.data;
    },
  });
}

export function useNoticeDetailQuery(noticeId: number | null) {
  return useQuery({
    queryKey: noticeKeys.detail(noticeId ?? 0),
    queryFn: async () => {
      if (noticeId === null) return null;
      const response = await getNoticeDetailApi(noticeId);
      return response.data;
    },
    enabled: noticeId !== null,
  });
}

export function useCreateNoticeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NoticeCreateRequest) => createNoticeApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.all });
    },
  });
}

export function useUpdateNoticeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: NoticeUpdateRequest }) =>
      updateNoticeApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.all });
    },
  });
}

export function useDeleteNoticeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteNoticeApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.all });
    },
  });
}
