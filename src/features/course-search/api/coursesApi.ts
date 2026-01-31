import { api } from "@shared/api/axios";
import type {
  CourseSearchRequest,
  CourseSearchResponse,
} from "@entities/course";

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
