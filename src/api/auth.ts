import {api} from './axios';
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from '../mocks/apiTypes';

// 로그인 API
export const loginApi = async (data: LoginRequest) => {
  return await api.post<LoginResponse>('/api/auth/login', data);
};

// 로그아웃 API 호출 함수
export const logoutApi = async () => {
  // axios.ts의 interceptor가 토큰을 자동으로 헤더에 넣어줍니다.
  return await api.post('/api/auth/logout');
};

// 회원가입 API
export const signupApi = (data: SignupRequest) => {
  return api.post<SignupResponse>('/api/auth/signup', data);
};
