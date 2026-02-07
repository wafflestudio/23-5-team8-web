import { api } from '@shared/api/axios';
import type { AdminDbStatsResponse } from '../model/types';

export const getAdminStatsApi = async () => {
  return await api.get<AdminDbStatsResponse>('/api/admin/stats');
};
