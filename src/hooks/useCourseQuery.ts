import {useQuery} from '@tanstack/react-query';
import {searchCoursesApi, getCourseByIdApi} from '../api/courses';
import type {CourseSearchRequest} from '../types/apiTypes';

export const courseKeys = {
  all: ['courses'] as const,
  search: (params: CourseSearchRequest) => [...courseKeys.all, 'search', params] as const,
  detail: (courseId: number) => [...courseKeys.all, 'detail', courseId] as const,
};

export function useCourseSearchQuery(params: CourseSearchRequest, enabled = true) {
  return useQuery({
    queryKey: courseKeys.search(params),
    queryFn: async () => {
      const response = await searchCoursesApi(params);
      return response.data;
    },
    enabled,
  });
}

export function useCourseDetailQuery(courseId: number, enabled = true) {
  return useQuery({
    queryKey: courseKeys.detail(courseId),
    queryFn: async () => {
      const response = await getCourseByIdApi(courseId);
      return response.data;
    },
    enabled: enabled && courseId > 0,
  });
}
