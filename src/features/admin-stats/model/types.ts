export interface AdminDbStatsResponse {
  userCount: number;
  practiceDetailCount: number;
}

export interface ReactionTimeHistogramResponse {
  binSizeMs: number;
  maxMs: number;
  overflowCount: number;
  bins: number[];
}

export interface DailyStatsEntry {
  date: string;
  count: number;
}

export interface DailyStatsResponse {
  dailyActiveUsers: DailyStatsEntry[];
  dailyNewUsers: DailyStatsEntry[];
  dailyPracticeDetailCounts: DailyStatsEntry[];
}

export type AggregationMode = 'daily' | 'weekly' | 'monthly';
