import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMyPageApi,
  updateProfileApi,
  getPresignedUrlApi,
  uploadToPresignedUrlApi,
  updatePasswordApi,
  deleteAccountApi,
  getPracticeSessionsApi,
  getPracticeSessionDetailApi,
  getEnrolledCoursesApi,
} from '../api/mypage';
import type {
  MyPageResponse,
  ChangePasswordRequest,
  PracticeSessionsListResponse,
  PracticeResultResponse,
  CourseDetailResponse,
} from '../types/apiTypes';

// Query Keys
export const myPageKeys = {
  all: ['mypage'] as const,
  profile: () => [...myPageKeys.all, 'profile'] as const,
  sessions: (page?: number) => [...myPageKeys.all, 'sessions', page] as const,
  sessionDetail: (id: number) => [...myPageKeys.all, 'session', id] as const,
  enrolledCourses: () => [...myPageKeys.all, 'enrolled-courses'] as const,
};

// 마이페이지 조회
export const useMyPageQuery = () => {
  return useQuery<MyPageResponse>({
    queryKey: myPageKeys.profile(),
    queryFn: async () => {
      const response = await getMyPageApi();
      return response.data;
    },
  });
};

// 닉네임 수정 Mutation
export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { nickname: string }) => updateProfileApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myPageKeys.profile() });
    },
  });
};

// 프로필 이미지 업로드 Mutation (Presigned URL 방식)
export const useUpdateProfileImageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      // Step 1: Presigned URL 받기 (파일명과 타입 전달)
      const { data: urlData } = await getPresignedUrlApi(file.name, file.type);

      // Step 2: Presigned URL로 파일 업로드
      await uploadToPresignedUrlApi(urlData.presignedUrl, file);

      // Step 3: 이미지 URL로 프로필 업데이트 (같은 /api/mypage/profile 엔드포인트 사용)
      return await updateProfileApi({ profileImageUrl: urlData.imageUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myPageKeys.profile() });
    },
  });
};

// 비밀번호 변경 Mutation
export const useUpdatePasswordMutation = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => updatePasswordApi(data),
  });
};

// 회원 탈퇴 Mutation
export const useDeleteAccountMutation = () => {
  return useMutation({
    mutationFn: (password: string) => deleteAccountApi(password),
  });
};

// 연습 세션 목록 조회
export const usePracticeSessionsQuery = (
  page: number = 0,
  size: number = 10
) => {
  return useQuery<PracticeSessionsListResponse>({
    queryKey: myPageKeys.sessions(page),
    queryFn: async () => {
      const response = await getPracticeSessionsApi(page, size);
      return response.data;
    },
    refetchInterval: 5000, // 5초마다 자동 refetch
  });
};

// 연습 세션 상세 조회
export const usePracticeSessionDetailQuery = (practiceLogId: number) => {
  return useQuery<PracticeResultResponse>({
    queryKey: myPageKeys.sessionDetail(practiceLogId),
    queryFn: async () => {
      const response = await getPracticeSessionDetailApi(practiceLogId);
      return response.data;
    },
    enabled: practiceLogId > 0,
  });
};

// 가장 최근 연습 세션에서 성공한 강의 목록 조회
export const useEnrolledCoursesQuery = () => {
  return useQuery<CourseDetailResponse[]>({
    queryKey: myPageKeys.enrolledCourses(),
    queryFn: async () => {
      console.log(
        '🔍 Fetching enrolled courses from /api/practice/enrolled-courses'
      );
      const response = await getEnrolledCoursesApi();
      console.log('✅ Enrolled courses response:', response.data);
      return response.data;
    },
    retry: 1,
  });
};
