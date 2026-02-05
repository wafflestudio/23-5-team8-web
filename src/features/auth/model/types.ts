export interface UserDto {
  id: number;
  nickname: string;
  admin: boolean;
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
