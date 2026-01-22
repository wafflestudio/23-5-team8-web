import { api } from "./axios";
import type {
  CourseSearchRequest,
  CourseSearchResponse,
  Course,
} from "../types/apiTypes";

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

export const getCourseByIdApi = async (
  courseId: number,
) => {
  return await api.get<Course>(
    `/api/courses/${courseId}`,
  );
};
