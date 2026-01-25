import { api } from './axios';
import type {
  MyPageResponse,
  UpdateProfileRequest,
  UpdatePasswordRequest,
  PracticeSessionsResponse,
  PracticeSessionDetailResponse,
  Course,
} from '../types/apiTypes';

// 마이페이지 조회
export const getMyPageApi = async () => {
  return await api.get<MyPageResponse>('/api/mypage');
};

// 프로필 수정 (닉네임, 프로필사진)
export const updateProfileApi = async (data: UpdateProfileRequest) => {
  const formData = new FormData();
  if (data.nickname) {
    formData.append('nickname', data.nickname);
  }
  if (data.profileImage) {
    formData.append('profileImage', data.profileImage);
  }
  return await api.put('/api/mypage/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 비밀번호 변경
export const updatePasswordApi = async (data: UpdatePasswordRequest) => {
  return await api.put('/api/mypage/password', data);
};

// 회원 탈퇴
export const deleteAccountApi = async (password: string) => {
  return await api.delete('/api/mypage', {
    data: { password },
  });
};

// 연습 세션 목록 조회 (페이지네이션)
export const getPracticeSessionsApi = async (
  page: number = 0,
  size: number = 10
) => {
  return await api.get<PracticeSessionsResponse>(
    `/api/mypage/practice-sessions?page=${page}&size=${size}`
  );
};

// 연습 세션 상세 조회
export const getPracticeSessionDetailApi = async (practiceLogId: number) => {
  return await api.get<PracticeSessionDetailResponse>(
    `/api/mypage/practice-sessions/${practiceLogId}`
  );
};

// 가장 최근 연습 세션에서 성공한 강의 목록 조회
export const getEnrolledCoursesApi = async () => {
  return await api.get<Course[]>('/api/practice/enrolled-courses');
};
