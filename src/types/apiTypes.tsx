// src/mocks/apiTypes.ts
// Updated type definitions for practice sessions API

export interface UserDto {
  id: number;
  nickname: string;
}

export interface LoginResponse {
  user: UserDto;
  accessToken: string;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  errorCode: string;
  validationErrors?: Record<string, string> | null;
}

export interface LoginRequest {
  email?: string;
  password?: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
  profileImageUrl?: string;
}

export interface SocialLoginRequest {
  code: string;
  redirectUri?: string;
}

export interface SignupResponse {
  user: {
    id: number;
    nickname: string;
  };
  accessToken: string;
}

// 강의 검색 관련 타입
export interface CourseSearchRequest {
  query?: string;
  page?: number;
  size?: number;
}

export interface CourseSearchResponse {
  items: Course[];
  pageInfo: PageInfo;
}

export interface Course {
  id: number;
  courseNumber: string;
  courseTitle: string;
  instructor: string;
  credit: number;
  department: string;
  year: number;
  semester: string;
  classification: string;
  placeAndTime: string | null;
  quota: number;
  freshmanQuota: number | null;
  college?: string;
  academicCourse?: string;
  academicYear?: string;
  lectureNumber?: string;
}

export interface PageInfo {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// 장바구니 관련 타입
export interface PreEnrollAddRequest {
  courseId: number;
  cartCount: number;
}

export interface PreEnrollUpdateCartCountRequest {
  cartCount: number;
}

export interface PreEnrollCourseResponse {
  preEnrollId: number;
  course: Course;
  cartCount: number;
}

// 연습 수강신청 관련 타입
export interface PracticeRegisterRequest {
  courseId: number;
  totalCompetitors: number;
  capacity: number;
}

// 리더보드 관련 타입
export interface LeaderboardEntryResponse {
  userId: number;
  nickname: string;
  profileImageUrl: string;
  value: number;
}

export interface LeaderboardResponse {
  topFirstReactionTime: LeaderboardEntryResponse[];
  topSecondReactionTime: LeaderboardEntryResponse[];
  topCompetitionRate: LeaderboardEntryResponse[];
}

export interface MyLeaderboardResponse {
  bestFirstReactionTime: number | null;
  bestFirstReactionTimeRank: number | null;
  bestSecondReactionTime: number | null;
  bestSecondReactionTimeRank: number | null;
  bestCompetitionRate: number | null;
  bestCompetitionRateRank: number | null;
}

export interface PracticeAttemptResponse {
  isSuccess: boolean;
  message: string;
}

export interface PracticeAttemptDetail {
  courseId: number;
  courseTitle: string;
  lectureNumber: string;
  success: boolean;
  rank: number;
  percentile: number;
  reactionTime: number;
}

export interface PracticeResultResponse {
  practiceLogId: number;
  practiceAt: string;
  earlyClickDiff: number | null;
  totalAttempts: number;
  successCount: number;
  attempts: PracticeAttemptDetail[];
}

// 마이페이지 관련 타입
export interface MyPageResponse {
  nickname: string;
  email: string;
  profileImageUrl: string | null;
  latestPracticeSession: PracticeSessionSummary | null;
}

export interface PracticeSessionSummary {
  practiceDate: string;
  duration: number;
  totalCredits: number;
  successRate: number;
  successfulCourses: SuccessfulCourse[];
}

export interface SuccessfulCourse {
  courseName: string;
  professor: string;
  credits: number;
}

export interface UpdateProfileRequest {
  nickname?: string;
  profileImage?: File;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface PracticeSessionsResponse {
  items: PracticeSessionItem[];
  pageInfo: PageInfo & { hasNext: boolean };
}

export interface PracticeSessionItem {
  id: number;
  practiceAt: string;
  totalAttempts: number;
  successCount: number;
}

export interface PracticeSessionDetailResponse {
  practiceLogId: number;
  practiceAt: string;
  earlyClickDiff: number | null;
  totalAttempts: number;
  successCount: number;
  attempts: PracticeAttemptDetail[];
}
