import {http, HttpResponse, delay} from 'msw';
import {
  type LoginRequest,
  type SignupRequest,
  type SocialLoginRequest,
  type ErrorResponse,
} from './apiTypes'; // 경로가 맞는지 확인해주세요

const BASE_URL = '/api/auth';

// 에러 응답 생성 헬퍼 함수
const createErrorResponse = (
  status: number,
  error: string,
  message: string,
  errorCode: string,
  validationErrors: Record<string, string> | null = null
): ErrorResponse => {
  return {
    timestamp: new Date().toISOString(),
    status,
    error,
    message,
    errorCode,
    validationErrors,
  };
};

export const handlers = [
  /**
   * -------------------------------------------------------
   * 1. 로그인 (POST /api/auth/login)
   * -------------------------------------------------------
   * [성공] email: "test@snu.ac.kr", password: "test1234!"
   * [실패-401] 비밀번호 틀림
   * [실패-400] 이메일 형식이 아님
   */
  http.post(`${BASE_URL}/login`, async ({request}) => {
    await delay(500); // 네트워크 딜레이 시뮬레이션
    const body = (await request.json()) as LoginRequest;

    // 1. 유효성 검증 시뮬레이션 (400)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (body.email && !emailRegex.test(body.email)) {
      return HttpResponse.json(
        createErrorResponse(
          400,
          'Bad Request',
          '입력 값이 유효하지 않습니다',
          'VALIDATION_FAILED',
          {
            email: '올바른 이메일 형식이 아닙니다',
          }
        ),
        {status: 400}
      );
    }

    // 2. 로그인 성공 (200)
    if (body.email === 'test@snu.ac.kr' && body.password === 'test1234!') {
      return HttpResponse.json({
        user: {id: 1, nickname: '김와플'},
        accessToken: 'mock-access-token-jwt-example',
      });
    }

    // 3. 인증 실패 (401) - 그 외 모든 입력
    return HttpResponse.json(
      createErrorResponse(
        401,
        'UNAUTHORIZED',
        '이메일 또는 비밀번호가 올바르지 않습니다',
        'UNAUTHORIZED'
      ),
      {status: 401}
    );
  }),

  /**
   * -------------------------------------------------------
   * 2. 회원가입 (POST /api/auth/signup)
   * -------------------------------------------------------
   * [성공] 일반적인 데이터
   * [실패-409] email: "duplicate@example.com" (중복)
   * [실패-400] password가 "bad" 인 경우 (정규식 위반)
   */
  http.post(`${BASE_URL}/signup`, async ({request}) => {
    await delay(500);
    const body = (await request.json()) as SignupRequest;

    // 1. 중복 이메일 시뮬레이션 (409)
    if (body.email === 'duplicate@example.com') {
      return HttpResponse.json(
        createErrorResponse(
          409,
          'Conflict',
          '이미 사용 중인 이메일입니다',
          'DUPLICATE_EMAIL'
        ),
        {status: 409}
      );
    }

    // 2. 비밀번호 유효성 검사 시뮬레이션 (400)
    // Swagger 조건: 영문, 숫자, 특수문자 포함 8자 이상
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/;
    // 테스트 편의를 위해 "bad"라는 비밀번호를 보내면 에러 처리
    if (
      body.password === 'bad' ||
      (body.password && !passwordRegex.test(body.password))
    ) {
      return HttpResponse.json(
        createErrorResponse(
          400,
          'Bad Request',
          '입력 값이 유효하지 않습니다',
          'VALIDATION_FAILED',
          {
            password: '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다',
          }
        ),
        {status: 400}
      );
    }

    // 3. 회원가입 성공 (201)
    return HttpResponse.json(
      {
        user: {id: Math.floor(Math.random() * 1000), nickname: body.nickname},
        accessToken: 'mock-signup-access-token',
      },
      {status: 201}
    );
  }),

  /**
   * -------------------------------------------------------
   * 3. 로그아웃 (POST /api/auth/logout)
   * -------------------------------------------------------
   * [성공] 헤더에 토큰이 있을 때
   * [실패-401] Authorization 헤더에 "Bearer invalid-token"을 보낼 때
   */
  http.post(`${BASE_URL}/logout`, ({request}) => {
    const authHeader = request.headers.get('Authorization');

    // 1. 토큰이 유효하지 않은 경우 시뮬레이션 (401)
    if (authHeader === 'Bearer invalid-token') {
      return HttpResponse.json(
        createErrorResponse(
          401,
          'UNAUTHORIZED',
          '인증에 실패했습니다',
          'UNAUTHORIZED'
        ),
        {status: 401}
      );
    }

    // 2. 로그아웃 성공 (204)
    return new HttpResponse(null, {status: 204});
  }),

  /**
   * -------------------------------------------------------
   * 4. 카카오 소셜 로그인 (POST /api/auth/kakao/login)
   * -------------------------------------------------------
   * [성공] code가 존재함
   * [실패-400] code가 없음
   * [실패-401] code가 "invalid-kakao-code" 일 때
   */
  http.post(`${BASE_URL}/kakao/login`, async ({request}) => {
    await delay(300);
    const body = (await request.json()) as SocialLoginRequest;

    // 1. 코드 누락 (400)
    if (!body.code) {
      return HttpResponse.json(
        createErrorResponse(
          400,
          'Bad Request',
          '입력 값이 유효하지 않습니다.',
          'VALIDATION_FAILED',
          {
            code: '인가 코드는 필수입니다',
          }
        ),
        {status: 400}
      );
    }

    // 2. 카카오 인증 실패 시뮬레이션 (401)
    if (body.code === 'invalid-kakao-code') {
      return HttpResponse.json(
        createErrorResponse(
          401,
          'UNAUTHORIZED',
          '카카오 인증에 실패했습니다',
          'UNAUTHORIZED'
        ),
        {status: 401}
      );
    }

    // 3. 성공 (200)
    return HttpResponse.json({
      user: {id: 2, nickname: '카카오유저'},
      accessToken: 'mock-kakao-access-token',
    });
  }),

  /**
   * -------------------------------------------------------
   * 5. 구글 소셜 로그인 (POST /api/auth/google/login)
   * -------------------------------------------------------
   * [성공] code가 존재함
   * [실패-400] code가 없음
   * [실패-401] code가 "invalid-google-code" 일 때
   */
  http.post(`${BASE_URL}/google/login`, async ({request}) => {
    await delay(300);
    const body = (await request.json()) as SocialLoginRequest;

    if (!body.code) {
      return HttpResponse.json(
        createErrorResponse(
          400,
          'Bad Request',
          '입력 값이 유효하지 않습니다',
          'VALIDATION_FAILED',
          {
            code: '인가 코드는 필수입니다',
          }
        ),
        {status: 400}
      );
    }

    if (body.code === 'invalid-google-code') {
      return HttpResponse.json(
        createErrorResponse(
          401,
          'UNAUTHORIZED',
          '구글 인증에 실패했습니다',
          'UNAUTHORIZED'
        ),
        {status: 401}
      );
    }

    return HttpResponse.json({
      user: {id: 3, nickname: '구글유저'},
      accessToken: 'mock-google-access-token',
    });
  }),

  // [추가] 회원가입 핸들러
  http.post('/api/auth/signup', async ({request}) => {
    const body = (await request.json()) as any;
    const {email, password, nickname} = body;

    // 1. 이메일 중복 시나리오 (테스트용: duplicate@test.com)
    if (email === 'duplicate@test.com') {
      return HttpResponse.json(
        {
          timestamp: new Date().toISOString(),
          status: 409,
          error: 'Conflict',
          message: '이미 사용 중인 이메일입니다',
          errorCode: 'DUPLICATE_EMAIL',
        },
        {status: 409}
      );
    }

    // 2. 유효성 검사 실패 시나리오 (예: 비밀번호가 너무 짧은 경우 - 백엔드 검증 흉내)
    if (password.length < 8) {
      return HttpResponse.json(
        {
          timestamp: new Date().toISOString(),
          status: 400,
          error: 'Bad Request',
          message: '입력 값이 유효하지 않습니다',
          errorCode: 'VALIDATION_FAILED',
          validationErrors: {
            password: '비밀번호는 8글자 이상이어야 합니다.',
          },
        },
        {status: 400}
      );
    }

    // 3. 성공 시나리오 (201 Created)
    return HttpResponse.json(
      {
        user: {
          id: Date.now(),
          nickname: nickname,
        },
        accessToken: 'mock-access-token-' + Date.now(),
      },
      {status: 201}
    );
  }),
];
