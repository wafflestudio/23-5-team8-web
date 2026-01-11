import axios from 'axios';

export const api = axios.create({
  // MSW 사용 시: 빈 문자열 ''로 설정 (상대 경로로 요청하면 MSW가 가로챕니다)
  // 실제 배포/연동 시: 'http://15.164.49.159' 등 실제 백엔드 주소 입력
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (선택사항: 토큰이 있다면 자동으로 헤더에 추가)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
