import type { CourseDetailResponse } from '@entities/course';

export interface PreEnrollAddRequest {
  courseId: number;
}

export interface PreEnrollDeleteRequest {
  courseId: number;
}

export interface PreEnrollUpdateCartCountRequest {
  cartCount: number;
}

export interface PreEnrollCourseResponse {
  preEnrollId: number;
  course: CourseDetailResponse;
  cartCount: number;
}
