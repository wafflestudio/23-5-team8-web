import React, {useState, useEffect, useCallback} from 'react';
import {AuthContext, type User} from './AuthContext';
import {logoutApi} from '../api/auth';

const MAX_LOGIN_TIME = 10 * 60;

export function AuthProvider({children}: {children: React.ReactNode}) {
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

  const logout = async () => {
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
  };

  const extendLogin = useCallback(() => {
    if (user) {
      setTimeLeft(MAX_LOGIN_TIME);
    }
  }, [user]);

  // ✅ 활동 감지 (클릭 또는 엔터키) -> 타이머 초기화
  useEffect(() => {
    if (!user) return;

    const handleActivity = (e: Event) => {
      // 1. 클릭 이벤트 처리
      if (e.type === 'click') {
        const target = e.target as HTMLElement;
        // 클릭한 요소가 버튼, 링크, 혹은 submit input 등인지 확인 (조상 요소 포함)
        const isInteractive = target.closest(
          'button, a, input[type="submit"], input[type="button"], [role="button"]'
        );

        // 상호작용 가능한 요소를 클릭했을 때만 연장
        if (isInteractive) {
          extendLogin();
        }
      }

      // 2. 키보드 이벤트 처리 (Enter 키만 인정)
      if (e.type === 'keydown') {
        const keyEvent = e as KeyboardEvent;

        if (keyEvent.key === 'Enter') {
          const target = keyEvent.target as HTMLElement;

          // 현재 포커스된 요소가 입력 가능한 태그인지 확인
          const isInputField =
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT';

          // 입력창 내부에서의 엔터일 때만 연장
          if (isInputField) {
            extendLogin();
          }
        }
      }
    };

    // 캡처링 단계(true)에서 이벤트를 잡아내어 확실하게 처리
    window.addEventListener('click', handleActivity, true);
    window.addEventListener('keydown', handleActivity, true);

    return () => {
      window.removeEventListener('click', handleActivity, true);
      window.removeEventListener('keydown', handleActivity, true);
    };
  }, [user, extendLogin]);

  // ✅ 1초마다 시간 감소 및 자동 로그아웃 처리
  useEffect(() => {
    if (!user) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          logout(); // 시간 종료 시 로그아웃
          alert('장시간 미사용으로 자동 로그아웃 되었습니다.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [user, logout]);
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider
      value={{user, login, logout, isLoggedIn, timeLeft, extendLogin}}
    >
      {children}
    </AuthContext.Provider>
  );
}
