import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://allclear.codes/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (선택사항: 토큰이 있다면 자동으로 헤더에 추가)
api.interceptors.request.use((config) => {
  const token =
    sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
