import { api } from "./axios";
import type { PracticeRegisterRequest } from "../types/apiTypes.tsx";

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

export const getLatestPracticeLogApi =
  async () => {
    return await api.get(
      "/api/practice/logs/latest",
      {
        withCredentials: true,
      },
    );
  };

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
