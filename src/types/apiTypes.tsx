// src/mocks/apiTypes.ts

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
  keyword?: string;
  page?: number;
  size?: number;
}

export interface CourseSearchResponse {
  content: Course[];
  pageInfo: PageInfo;
}

export interface Course {
  id: number;
  courseNumber: string;
  courseName: string;
  professor: string;
  credit: number;
  department: string;
  year: number;
  semester: string;
  classification: string;
  schedule: string;
  capacity: number;
  currentEnrollment: number;
  remarks?: string;
}

export interface PageInfo {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
