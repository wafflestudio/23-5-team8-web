// src/mocks/apiTypes.ts

export interface UserDto {
  id: number;
  nickname: string;
}

export interface LoginResponse {
  user: UserDto;
  accessToken: string;
}

export interface SignupResponse {
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

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface SignupResponse {
  user: {
    id: number;
    nickname: string;
  };
  accessToken: string;
}
