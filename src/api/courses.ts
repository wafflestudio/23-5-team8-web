import { api } from "./axios";
import type {
  CourseSearchRequest,
  CourseSearchResponse,
  Course,
} from "../types/apiTypes";

// 강의 검색 API
export const searchCoursesApi = async (
  params: CourseSearchRequest,
) => {
  return await api.get<CourseSearchResponse>(
    "/api/courses/search",
    {
      params,
    },
  );
};

// 강의 ID로 단일 강의 조회 API
export const getCourseByIdApi = async (
  courseId: number,
) => {
  return await api.get<Course>(
    `/api/courses/${courseId}`,
  );
};
