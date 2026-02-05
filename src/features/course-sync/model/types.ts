export interface CourseSyncRunRequest {
  year: number;
  semester: 'SPRING' | 'SUMMER' | 'FALL' | 'WINTER';
}

export interface CourseSyncRunResponse {
  accepted: boolean;
  startedAt: string;
}

export interface LastRunInfo {
  status: 'SUCCESS' | 'FAILED' | 'RUNNING';
  startedAt: string;
  finishedAt: string | null;
  year: number;
  semester: 'SPRING' | 'SUMMER' | 'FALL' | 'WINTER';
  rowsUpserted: number | null;
  message: string | null;
}

export interface CourseSyncAutoStatusResponse {
  enabled: boolean;
  intervalMinutes: number;
  lastRun: LastRunInfo | null;
  updatedAt: string;
}
