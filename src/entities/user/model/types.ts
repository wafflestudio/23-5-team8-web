import type { PageInfo } from '@shared/types';

export interface UserDto {
  id: number;
  nickname: string;
}

export interface MyPageResponse {
  nickname: string;
  profileImageUrl: string;
}

export interface UpdateProfileRequest {
  nickname?: string;
  profileImageUrl?: string;
}

export interface UpdateProfileResponse {
  nickname: string;
  profileImageUrl: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface MyPageUpdateRequest {
  nickname?: string;
  profileImageUrl?: string;
}

export interface PracticeSessionItem {
  id: number;
  practiceAt: string;
  totalAttempts: number;
  successCount: number;
}

export interface PracticeSessionsListResponse {
  items: PracticeSessionItem[];
  pageInfo: PageInfo;
}

export interface PracticeAttemptResult {
  courseId: number;
  courseTitle: string;
  lectureNumber: string;
  rank: number;
  percentile: number;
  reactionTime: number;
  isSuccess: boolean;
}

export interface PracticeResultResponse {
  practiceLogId?: number;
  practiceAt: string;
  earlyClickDiff: number | null;
  totalAttempts: number;
  successCount: number;
  attempts: PracticeAttemptResult[];
}

export interface CourseDetailResponse {
  id: number;
  year: number;
  semester: 'SPRING' | 'SUMMER' | 'FALL' | 'WINTER';
  classification?: string;
  college?: string;
  department?: string;
  academicCourse?: string;
  academicYear?: string;
  courseNumber: string;
  lectureNumber: string;
  courseTitle: string;
  credit?: number;
  instructor?: string;
  placeAndTime?: string;
  quota: number;
  freshmanQuota: number;
}
