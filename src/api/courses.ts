import { api } from "./axios";
import type {
  CourseSearchRequest,
  CourseSearchResponse,
} from "../mocks/apiTypes";

// 강의 검색 API
export const searchCoursesApi = async (
  params: CourseSearchRequest
) => {
  return await api.get<CourseSearchResponse>(
    "/api/courses/search",
    {
      params,
    }
  );
};
