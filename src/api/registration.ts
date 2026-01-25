import { api } from './axios';
import type { PracticeRegisterRequest } from '../types/apiTypes.ts';

export const practiceStartApi = async (virtualStartTimeOption: string) => {
  return await api.post('/api/practice/start', {
    virtualStartTimeOption,
  });
};

export const practiceEndApi = async () => {
  return await api.post('/api/practice/end');
};

export const practiceAttemptApi = async (data: PracticeRegisterRequest) => {
  return await api.post('/api/practice/attempt', data);
};

export const getPracticeResultApi = async (practiceLogId: number) => {
  return await api.get(`/api/practice/results/${practiceLogId}`);
};

export const getLatestPracticeLogApi = async () => {
  return await api.get('/api/practice/logs/latest', {});
};

export const deletePracticeDetailApi = async (detailId: number) => {
  return await api.delete(`/api/practice/details/${detailId}`);
};
