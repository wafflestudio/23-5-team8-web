// ==================== Auth Types ====================
// 인증 관련 타입 정의 (로그인, 회원가입, 소셜 로그인)

export interface UserDto {
  id: number;
  nickname: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: UserDto;
  accessToken: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  nickname?: string;
  profileImageUrl?: string;
}

export interface SignupResponse {
  user: UserDto;
  accessToken: string;
}

export interface SocialLoginRequest {
  code: string;
  redirectUri?: string;
}

export interface SocialLoginResponse {
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

// ==================== Course Types ====================
// 강좌 관련 타입 정의 (강좌 검색, 강좌 정보)

export type Semester = 'SPRING' | 'SUMMER' | 'FALL' | 'WINTER';

export interface CourseSearchRequest {
  query?: string;
  courseNumber?: string;
  academicCourse?: string;
  academicYear?: number;
  college?: string;
  department?: string;
  classification?: string;
  page: number;
  size: number;
}

export interface CourseDetailResponse {
  id: number;
  year: number;
  semester: Semester;
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
  freshmanQuota?: number;
}

export interface PageInfo {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export interface CourseSearchResponse {
  items: CourseDetailResponse[];
  pageInfo: PageInfo;
}

// ==================== Pre-Enroll (Cart) Types ====================
// 장바구니 관련 타입 정의 (사전 수강신청)

export interface PreEnrollAddRequest {
  courseId: number;
}

export interface PreEnrollDeleteRequest {
  courseId: number;
}

export interface PreEnrollUpdateCartCountRequest {
  cartCount: number;
}

export interface PreEnrollCourseResponse {
  preEnrollId: number;
  course: CourseDetailResponse;
  cartCount: number;
}

// ==================== Practice Session Types ====================
// 연습 세션 관련 타입 정의 (수강신청 시뮬레이션)

export type VirtualStartTimeOption =
  | 'TIME_08_29_00'
  | 'TIME_08_29_30'
  | 'TIME_08_29_45';

export interface PracticeStartRequest {
  virtualStartTimeOption?: VirtualStartTimeOption;
}

export interface PracticeStartResponse {
  practiceLogId?: number;
  virtualStartTime?: string;
  targetTime?: string;
  timeLimitSeconds?: number;
  message?: string;
}

export interface PracticeEndResponse {
  message?: string;
  totalAttempts?: number;
}

export interface PracticeAttemptRequest {
  courseId: number;
  totalCompetitors: number;
  capacity: number;
}

export interface PracticeAttemptResponse {
  message: string;
  userLatencyMs: number;
  success: boolean;
}

// ==================== Leaderboard Types ====================
// 리더보드 관련 타입 정의 (전체/주간 랭킹)

export interface LeaderboardEntryResponse {
  userId: number;
  nickname: string;
  profileImageUrl: string;
  value: number;
}

export interface LeaderboardRequest {
  page: number;
  size: number;
}

export interface LeaderboardCategoryResponse {
  items: LeaderboardEntryResponse[];
  pageInfo: PageInfo;
}

export interface LeaderboardResponse {
  topFirstReactionTime: LeaderboardCategoryResponse;
  topSecondReactionTime: LeaderboardCategoryResponse;
  topCompetitionRate: LeaderboardCategoryResponse;
}

export interface MyLeaderboardResponse {
  bestFirstReactionTime: number | null;
  bestFirstReactionTimeRank: number | null;
  bestSecondReactionTime: number | null;
  bestSecondReactionTimeRank: number | null;
  bestCompetitionRate: number | null;
  bestCompetitionRateRank: number | null;
}

// ==================== MyPage Types ====================
// 마이페이지 관련 타입 정의 (프로필, 비밀번호 변경, 연습 기록)

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

export interface MyPageResponse {
  nickname: string;
  profileImageUrl: string;
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
  success: boolean;
}

export interface PracticeResultResponse {
  practiceLogId?: number;
  practiceAt: string;
  earlyClickDiff: number | null;
  totalAttempts: number;
  successCount: number;
  attempts: PracticeAttemptResult[];
}
