import {api} from './axios';
import type {PracticeRegisterRequest} from '../types/apiTypes.tsx';

// 연습 세션 시작 API
export const practiceStartApi = async (vittualStartTimeOption: string) => {
  return await api.post(
    '/api/practice/start',
    {vittualStartTimeOption: vittualStartTimeOption},
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};

// 연습 세션 종료 API
export const practiceEndApi = async () => {
  return await api.post(
    '/api/practice/end',
    {},
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};

//수강신청 연습 시도 API
export const practiceAttemptApi = async (data: PracticeRegisterRequest) => {
  return await api.post('/api/practice/attempt', data, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
