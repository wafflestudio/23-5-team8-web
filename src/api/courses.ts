import {api} from './axios';
import type {
  CourseSearchRequest,
  CourseSearchResponse,
} from '../types/apiTypes';

// 강의 검색 API
export const searchCoursesApi = async (params: CourseSearchRequest) => {
  return await api.get<CourseSearchResponse>('/api/courses/search', {
    params,
  });
};
