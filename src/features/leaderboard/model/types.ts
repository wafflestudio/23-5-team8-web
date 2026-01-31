import type { PageInfo } from '@shared/types';

export interface LeaderboardEntryResponse {
  userId: number;
  nickname: string;
  profileImageUrl: string;
  value: number;
}

export interface LeaderboardRequest {
  page: number;
  size: number;
}

export interface LeaderboardCategoryResponse {
  items: LeaderboardEntryResponse[];
  pageInfo: PageInfo;
}

export interface LeaderboardResponse {
  topFirstReactionTime: LeaderboardCategoryResponse;
  topSecondReactionTime: LeaderboardCategoryResponse;
  topCompetitionRate: LeaderboardCategoryResponse;
}

export interface MyLeaderboardResponse {
  bestFirstReactionTime: number | null;
  bestFirstReactionTimeRank: number | null;
  bestSecondReactionTime: number | null;
  bestSecondReactionTimeRank: number | null;
  bestCompetitionRate: number | null;
  bestCompetitionRateRank: number | null;
}
