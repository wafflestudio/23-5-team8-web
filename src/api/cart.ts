import { api } from "./axios";
import type {
  PreEnrollAddRequest,
  PreEnrollCourseResponse,
  PreEnrollUpdateCartCountRequest,
} from "../types/apiTypes.tsx";

// 장바구니 조회 API
export const getPreEnrollsApi = async (
  overQuotaOnly = false,
) => {
  return await api.get<PreEnrollCourseResponse[]>(
    "/api/pre-enrolls",
    {
      params: {
        overQuotaOnly,
      },
    },
  );
};

// 장바구니에 강의 추가 API
export const addPreEnrollApi = async (
  data: PreEnrollAddRequest,
) => {
  return await api.post<PreEnrollCourseResponse>(
    "/api/pre-enrolls",
    data,
  );
};

// 장바구니 항목 cartCount 수정 API
export const updateCartCountApi = async (
  courseId: number,
  data: PreEnrollUpdateCartCountRequest,
) => {
  return await api.patch<PreEnrollCourseResponse>(
    `/api/pre-enrolls/${courseId}/cart-count`,
    data,
  );
};

// 장바구니에서 강의 삭제 API
export const deletePreEnrollApi = async (
  courseId: number,
) => {
  return await api.delete(
    `/api/pre-enrolls/${courseId}`,
  );
};
