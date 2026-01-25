import {useQuery} from '@tanstack/react-query';
import {searchCoursesApi} from '../api/courses';
import type {CourseSearchRequest} from '../types/apiTypes';

export const courseKeys = {
  all: ['courses'] as const,
  search: (params: CourseSearchRequest) => [...courseKeys.all, 'search', params] as const,
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
