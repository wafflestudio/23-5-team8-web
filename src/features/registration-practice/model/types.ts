import type { CourseDetailResponse, VirtualStartTimeOption } from '@entities/course';

export type { VirtualStartTimeOption };

export interface PracticeStartRequest {
  virtualStartTimeOption?: VirtualStartTimeOption;
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
