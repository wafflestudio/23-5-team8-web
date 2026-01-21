import {api} from './axios';
import type {LeaderboardResponse, MyLeaderboardResponse} from '../types/apiTypes';

export const getLeaderboardApi = async (limit: number = 10) => {
  return await api.get<LeaderboardResponse>('/api/leaderboard', {
    params: {limit},
  });
};

export const getWeeklyLeaderboardApi = async (limit: number = 10) => {
  return await api.get<LeaderboardResponse>('/api/leaderboard/weekly', {
    params: {limit},
  });
};

export const getMyLeaderboardApi = async () => {
  return await api.get<MyLeaderboardResponse>('/api/leaderboard/me');
};

export const getMyWeeklyLeaderboardApi = async () => {
  return await api.get<MyLeaderboardResponse>('/api/leaderboard/weekly/me');
};
