import { api } from './axios';
import type {
  MyPageResponse,
  UpdateProfileResponse,
  ChangePasswordRequest,
  PracticeSessionsListResponse,
  PracticeResultResponse,
  CourseDetailResponse,
} from '../types/apiTypes';

// 마이페이지 조회
export const getMyPageApi = async () => {
  return await api.get<MyPageResponse>('/api/mypage');
};

// 프로필 수정 (닉네임, 프로필 이미지 URL)
export const updateProfileApi = async (data: {
  nickname?: string;
  profileImageUrl?: string;
}) => {
  return await api.patch<UpdateProfileResponse>('/api/mypage/profile', data);
};

// 프로필 이미지 업로드 - Presigned URL 방식
// Step 1: Presigned URL 요청 (파일명과 타입 전송)
export const getPresignedUrlApi = async (
  fileName: string,
  fileType: string
) => {
  return await api.post<{ presignedUrl: string; imageUrl: string }>(
    '/api/mypage/profile-image/presigned-url',
    {
      fileName,
      contentType: fileType,
    }
  );
};

// Step 2: Presigned URL로 파일 직접 업로드 (S3 등)
export const uploadToPresignedUrlApi = async (
  presignedUrl: string,
  file: File
) => {
  const response = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to upload image to presigned URL');
  }
  return response;
};

// 비밀번호 변경
export const updatePasswordApi = async (data: ChangePasswordRequest) => {
  return await api.patch<void>('/api/mypage/password', data);
};

// 회원 탈퇴
export const deleteAccountApi = async (password: string) => {
  return await api.delete<void>('/api/mypage', {
    data: { password },
  });
};

// 연습 세션 목록 조회 (페이지네이션)
export const getPracticeSessionsApi = async (
  page: number = 0,
  size: number = 10
) => {
  return await api.get<PracticeSessionsListResponse>(
    `/api/mypage/practice-sessions?page=${page}&size=${size}`
  );
};

// 연습 세션 상세 조회
export const getPracticeSessionDetailApi = async (practiceLogId: number) => {
  return await api.get<PracticeResultResponse>(
    `/api/mypage/practice-sessions/${practiceLogId}`
  );
};

// 가장 최근 연습 세션에서 성공한 강의 목록 조회
export const getEnrolledCoursesApi = async () => {
  return await api.get<CourseDetailResponse[]>(
    '/api/practice/enrolled-courses'
  );
};
