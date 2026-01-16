import { http, HttpResponse, delay } from "msw";
import {
  type LoginRequest,
  type SignupRequest,
  type SocialLoginRequest,
  type ErrorResponse,
} from "./apiTypes";

const BASE_URL = "/api/auth";

// 에러 응답 생성 헬퍼 함수
const createErrorResponse = (
  status: number,
  error: string,
  message: string,
  errorCode: string,
  validationErrors: Record<
    string,
    string
  > | null = null
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
   */
  http.post(
    `${BASE_URL}/login`,
    async ({ request }) => {
      await delay(500);
      const body =
        (await request.json()) as LoginRequest;

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (
        body.email &&
        !emailRegex.test(body.email)
      ) {
        return HttpResponse.json(
          createErrorResponse(
            400,
            "Bad Request",
            "입력 값이 유효하지 않습니다",
            "VALIDATION_FAILED",
            {
              email:
                "올바른 이메일 형식이 아닙니다",
            }
          ),
          { status: 400 }
        );
      }

      if (
        body.email === "test@snu.ac.kr" &&
        body.password === "test1234!"
      ) {
        return HttpResponse.json({
          user: { id: 1, nickname: "김와플" },
          accessToken:
            "mock-access-token-jwt-example",
        });
      }

      return HttpResponse.json(
        createErrorResponse(
          401,
          "UNAUTHORIZED",
          "이메일 또는 비밀번호가 올바르지 않습니다",
          "UNAUTHORIZED"
        ),
        { status: 401 }
      );
    }
  ),

  /**
   * -------------------------------------------------------
   * 2. 회원가입 (POST /api/auth/signup)
   * -------------------------------------------------------
   */
  http.post(
    `${BASE_URL}/signup`,
    async ({ request }) => {
      await delay(500);
      // ✅ [수정] any 제거하고 SignupRequest 타입 사용
      const body =
        (await request.json()) as SignupRequest;
      const { email, password, nickname } = body;

      // 1. 중복 이메일 시뮬레이션
      if (
        email === "duplicate@example.com" ||
        email === "duplicate@test.com"
      ) {
        return HttpResponse.json(
          createErrorResponse(
            409,
            "Conflict",
            "이미 사용 중인 이메일입니다",
            "DUPLICATE_EMAIL"
          ),
          { status: 409 }
        );
      }

      // 2. 유효성 검사 실패 시뮬레이션 (비밀번호 8자 미만 등)
      if (password.length < 8) {
        return HttpResponse.json(
          createErrorResponse(
            400,
            "Bad Request",
            "입력 값이 유효하지 않습니다",
            "VALIDATION_FAILED",
            {
              password:
                "비밀번호는 8글자 이상이어야 합니다.",
            }
          ),
          { status: 400 }
        );
      }

      // 3. 회원가입 성공
      return HttpResponse.json(
        {
          user: {
            id: Date.now(),
            nickname: nickname,
          },
          accessToken:
            "mock-signup-access-token-" +
            Date.now(),
        },
        { status: 201 }
      );
    }
  ),

  /**
   * -------------------------------------------------------
   * 3. 로그아웃 (POST /api/auth/logout)
   * -------------------------------------------------------
   */
  http.post(
    `${BASE_URL}/logout`,
    ({ request }) => {
      const authHeader = request.headers.get(
        "Authorization"
      );

      if (authHeader === "Bearer invalid-token") {
        return HttpResponse.json(
          createErrorResponse(
            401,
            "UNAUTHORIZED",
            "인증에 실패했습니다",
            "UNAUTHORIZED"
          ),
          { status: 401 }
        );
      }
      return new HttpResponse(null, {
        status: 204,
      });
    }
  ),

  /**
   * -------------------------------------------------------
   * 4. 카카오 소셜 로그인 (POST /api/auth/kakao/login)
   * -------------------------------------------------------
   */
  http.post(
    `${BASE_URL}/kakao/login`,
    async ({ request }) => {
      await delay(300);
      const body =
        (await request.json()) as SocialLoginRequest;

      if (!body.code) {
        return HttpResponse.json(
          createErrorResponse(
            400,
            "Bad Request",
            "입력 값이 유효하지 않습니다.",
            "VALIDATION_FAILED",
            {
              code: "인가 코드는 필수입니다",
            }
          ),
          { status: 400 }
        );
      }

      if (body.code === "invalid-kakao-code") {
        return HttpResponse.json(
          createErrorResponse(
            401,
            "UNAUTHORIZED",
            "카카오 인증에 실패했습니다",
            "UNAUTHORIZED"
          ),
          { status: 401 }
        );
      }

      return HttpResponse.json({
        user: { id: 2, nickname: "카카오유저" },
        accessToken: "mock-kakao-access-token",
      });
    }
  ),

  /**
   * -------------------------------------------------------
   * 5. 구글 소셜 로그인 (POST /api/auth/google/login)
   * -------------------------------------------------------
   */
  http.post(
    `${BASE_URL}/google/login`,
    async ({ request }) => {
      await delay(300);
      const body =
        (await request.json()) as SocialLoginRequest;

      if (!body.code) {
        return HttpResponse.json(
          createErrorResponse(
            400,
            "Bad Request",
            "입력 값이 유효하지 않습니다",
            "VALIDATION_FAILED",
            {
              code: "인가 코드는 필수입니다",
            }
          ),
          { status: 400 }
        );
      }

      if (body.code === "invalid-google-code") {
        return HttpResponse.json(
          createErrorResponse(
            401,
            "UNAUTHORIZED",
            "구글 인증에 실패했습니다",
            "UNAUTHORIZED"
          ),
          { status: 401 }
        );
      }

      return HttpResponse.json({
        user: { id: 3, nickname: "구글유저" },
        accessToken: "mock-google-access-token",
      });
    }
  ),

  /**
   * -------------------------------------------------------
   * 6. 강의 검색 (GET /api/courses/search)
   * -------------------------------------------------------
   */
  http.get(
    "/api/courses/search",
    async ({ request }) => {
      await delay(300);
      const url = new URL(request.url);
      const keyword =
        url.searchParams.get("keyword") || "";
      const page = parseInt(
        url.searchParams.get("page") || "0"
      );
      const size = parseInt(
        url.searchParams.get("size") || "20"
      );

      // Mock 강의 데이터
      const mockCourses = [
        {
          id: 1,
          courseNumber: "001.101",
          courseName: "경제학원론",
          professor: "홍길동",
          credit: 3,
          department: "경제학부",
          year: 2026,
          semester: "1학기",
          classification: "전공필수",
          schedule: "월(3-1) 수(3-1)",
          capacity: 100,
          currentEnrollment: 85,
          remarks: "O",
        },
        {
          id: 2,
          courseNumber: "001.202",
          courseName: "미시경제학",
          professor: "김교수",
          credit: 3,
          department: "경제학부",
          year: 2026,
          semester: "1학기",
          classification: "전공선택",
          schedule: "화(2-1) 목(2-1)",
          capacity: 80,
          currentEnrollment: 70,
          remarks: "",
        },
        {
          id: 3,
          courseNumber: "001.303",
          courseName: "거시경제학",
          professor: "이교수",
          credit: 3,
          department: "경제학부",
          year: 2026,
          semester: "1학기",
          classification: "전공선택",
          schedule: "월(4-1) 수(4-1)",
          capacity: 80,
          currentEnrollment: 65,
          remarks: "C",
        },
        {
          id: 4,
          courseNumber: "001.404",
          courseName: "경제통계학",
          professor: "박교수",
          credit: 3,
          department: "경제학부",
          year: 2026,
          semester: "1학기",
          classification: "전공선택",
          schedule: "화(3-1) 목(3-1)",
          capacity: 60,
          currentEnrollment: 55,
          remarks: "",
        },
      ];

      // 키워드로 필터링
      const filteredCourses = mockCourses.filter(
        (course) =>
          course.courseName.includes(keyword) ||
          course.courseNumber.includes(keyword) ||
          course.professor.includes(keyword) ||
          course.department.includes(keyword)
      );

      const totalElements =
        filteredCourses.length;
      const totalPages = Math.ceil(
        totalElements / size
      );
      const startIdx = page * size;
      const endIdx = startIdx + size;
      const paginatedCourses =
        filteredCourses.slice(startIdx, endIdx);

      return HttpResponse.json({
        content: paginatedCourses,
        pageInfo: {
          page,
          size,
          totalElements,
          totalPages,
        },
      });
    }
  ),
];
