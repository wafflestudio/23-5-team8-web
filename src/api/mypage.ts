import {api} from './axios';
import type {
  MyPageResponse,
  MyPageUpdateRequest,
  PasswordChangeRequest,
  PracticeSessionsListResponse,
  PracticeResultResponse,
} from '../types/apiTypes';

export const getMyPageApi = async () => {
  return await api.get<MyPageResponse>('/api/mypage');
};

export const updateProfileApi = async (data: MyPageUpdateRequest) => {
  return await api.patch<MyPageResponse>('/api/mypage/profile', data);
};

export const changePasswordApi = async (data: PasswordChangeRequest) => {
  return await api.patch<void>('/api/mypage/password', data);
};

export const deleteAccountApi = async () => {
  return await api.delete<void>('/api/mypage');
};

export const getPracticeSessionsApi = async (page = 0, size = 10) => {
  return await api.get<PracticeSessionsListResponse>('/api/mypage/practice-sessions', {
    params: {page, size},
  });
};

export const getPracticeSessionDetailApi = async (practiceLogId: number) => {
  return await api.get<PracticeResultResponse>(
    `/api/mypage/practice-sessions/${practiceLogId}`
  );
};
