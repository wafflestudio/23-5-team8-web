import {api} from './axios';

export interface PracticeRegisterRequest {
  courseId: number;
  totalCompetitors: number;
  capacity: number;
}

// 연습 세션 시작 API
export const practiceStartApi = async () => {
  return await api.post(
    '/api/practice/start',
    {},
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    }
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
    }
  );
};

//수강신청 연습 시도 API
export const practiceAttemptApi = async (data: PracticeRegisterRequest) => {
  return await api.post('/api/practice/register', data, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
