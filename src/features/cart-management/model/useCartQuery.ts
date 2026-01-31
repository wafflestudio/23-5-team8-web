import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {
  getPreEnrollsApi,
  addPreEnrollApi,
  updateCartCountApi,
  deletePreEnrollApi,
} from '../api/cartApi';
import type {
  PreEnrollAddRequest,
  PreEnrollUpdateCartCountRequest,
} from './types';

export const cartKeys = {
  all: ['cart'] as const,
  list: (overQuotaOnly?: boolean) => [...cartKeys.all, 'list', overQuotaOnly] as const,
};

export function useCartQuery(overQuotaOnly = false) {
  return useQuery({
    queryKey: cartKeys.list(overQuotaOnly),
    queryFn: async () => {
      const response = await getPreEnrollsApi(overQuotaOnly);
      return response.data;
    },
  });
}

export function useAddToCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PreEnrollAddRequest) => addPreEnrollApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: cartKeys.all});
    },
  });
}

export function useUpdateCartCountMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      data,
    }: {
      courseId: number;
      data: PreEnrollUpdateCartCountRequest;
    }) => updateCartCountApi(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: cartKeys.all});
    },
  });
}

export function useDeleteFromCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: number) => deletePreEnrollApi(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: cartKeys.all});
    },
  });
}
