// src/contexts/AuthContext.tsx
import React, {createContext, useState, useContext, useEffect} from 'react';

// 유저 정보 타입 정의 (이름, 학번)
interface User {
  username: string; // 아이디
  name: string; // 이름 (예: 김와플)
  studentId: string; // 학번 (예: 2026-12345)
}

// Context에서 관리할 데이터와 함수 타입
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [user, setUser] = useState<User | null>(null);

  // 앱 시작 시 로컬 스토리지에서 유저 정보 복구 (새로고침 유지용)
  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 로그인 함수
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
    localStorage.setItem('authToken', 'dummy-token-' + Date.now()); // 토큰 저장
  };

  // 로그아웃 함수
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    localStorage.removeItem('authToken');
    window.location.href = '/';
  };

  const isLoggedIn = !!user; // user가 있으면 true

  return (
    <AuthContext.Provider value={{user, login, logout, isLoggedIn}}>
      {children}
    </AuthContext.Provider>
  );
}

// 컴포넌트에서 쉽게 쓰기 위한 커스텀 훅
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
