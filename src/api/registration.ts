import { api } from './axios';
import type { PracticeRegisterRequest, Course } from '../types/apiTypes.ts';

export const practiceStartApi = async (virtualStartTimeOption: string) => {
  return await api.post('/api/practice/start', {
    virtualStartTimeOption,
  });
};

export const practiceEndApi = async () => {
  return await api.post('/api/practice/end');
};

export const practiceAttemptApi = async (data: PracticeRegisterRequest) => {
  return await api.post('/api/practice/attempt', data);
};

export const getEnrolledCoursesApi = async () => {
  return await api.get<Course[]>('/api/practice/enrolled-courses');
};
