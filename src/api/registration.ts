import { api } from "./axios";
import type { PracticeRegisterRequest } from "../types/apiTypes.tsx";

// 연습 세션 시작 API
export const practiceStartApi = async (
  vittualStartTimeOption: string,
) => {
  return await api.post(
    "/api/practice/start",
    {
      vittualStartTimeOption:
        vittualStartTimeOption,
    },
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};

// 연습 세션 종료 API
export const practiceEndApi = async () => {
  return await api.post(
    "/api/practice/end",
    {},
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};

//수강신청 연습 시도 API
export const practiceAttemptApi = async (
  data: PracticeRegisterRequest,
) => {
  return await api.post(
    "/api/practice/attempt",
    data,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};

// 연습 결과 조회 API
export const getPracticeResultApi = async (
  practiceLogId: number,
) => {
  return await api.get(
    `/api/practice/results/${practiceLogId}`,
    {
      withCredentials: true,
    },
  );
};

// 최근 연습 로그 조회 API (가장 최근 세션 가져오기)
export const getLatestPracticeLogApi =
  async () => {
    return await api.get(
      "/api/practice/logs/latest",
      {
        withCredentials: true,
      },
    );
  };

// 수강신청 내역에서 삭제 API (practice detail 삭제)
export const deletePracticeDetailApi = async (
  detailId: number,
) => {
  return await api.delete(
    `/api/practice/details/${detailId}`,
    {
      withCredentials: true,
    },
  );
};
