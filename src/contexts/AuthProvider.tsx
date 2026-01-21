import React, {useState, useEffect, useCallback} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {AuthContext, type User} from './AuthContext';
import {logoutApi} from '../api/auth';

const MAX_LOGIN_TIME = 10 * 60;

export function AuthProvider({children}: {children: React.ReactNode}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = sessionStorage.getItem('userInfo');
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser) as User;
    } catch {
      sessionStorage.removeItem('userInfo');
      return null;
    }
  });

  const [timeLeft, setTimeLeft] = useState<number>(MAX_LOGIN_TIME);

  const login = (userData: User, accessToken: string) => {
    setUser(userData);
    sessionStorage.setItem('userInfo', JSON.stringify(userData));
    sessionStorage.setItem('authToken', accessToken);
    setTimeLeft(MAX_LOGIN_TIME);
  };

  const logout = useCallback(async () => {
    try {
      await logoutApi(); // 1. 서버에 로그아웃 요청
    } catch (error) {
      console.error('Logout API failed:', error);
    } finally {
      // 2. 클라이언트 정리 (성공/실패 여부와 상관없이 실행)
      setUser(null);
      sessionStorage.removeItem('userInfo');
      sessionStorage.removeItem('authToken');
    }
  }, []);

  const extendLogin = useCallback(() => {
    if (user) {
      setTimeLeft(MAX_LOGIN_TIME);
    }
  }, [user]);

  // ✅ 페이지 이동 시마다 로그인 시간 연장
  useEffect(() => {
    if (!user) return;
    extendLogin();
  }, [location, user, extendLogin]);

  // ✅ 1초마다 시간 감소 및 자동 로그아웃 처리
  useEffect(() => {
    if (!user) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          logout(); // 시간 종료 시 로그아웃
          navigate('/'); // 메인 페이지로 이동
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [user, logout, navigate]);

  return (
    <AuthContext.Provider value={{user, login, logout, timeLeft, extendLogin}}>
      {children}
    </AuthContext.Provider>
  );
}
