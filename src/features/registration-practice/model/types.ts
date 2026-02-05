import type { CourseDetailResponse, VirtualStartTimeOption } from '@entities/course';

export type { VirtualStartTimeOption };

export type { CaptchaDigit } from '../lib/captchaUtils';

export interface SelectedCourseInfo {
  totalCompetitors: number;
  capacity: number;
  title: string;
  courseNumber: string;
  lectureNumber: string;
}

export interface WaitingInfo {
  count: number;
  seconds: number;
}

export interface CourseData {
  preEnrollId: number;
  course: CourseDetailResponse;
  cartCount: number;
}

export interface PracticeStartRequest {
  virtualStartTimeOption?: VirtualStartTimeOption;
  randomOffsetMs?: number;
}

export interface PracticeStartResponse {
  practiceLogId?: number;
  virtualStartTime?: string;
  targetTime?: string;
  timeLimitSeconds?: number;
  message?: string;
}

export interface PracticeEndResponse {
  message?: string;
  totalAttempts?: number;
}

export interface PracticeAttemptRequest {
  courseId: number;
  totalCompetitors: number;
  capacity: number;
}

export interface PracticeAttemptResponse {
  isSuccess: boolean;
  message: string;
}

export type { CourseDetailResponse };
