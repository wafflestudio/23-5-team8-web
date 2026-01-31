import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext, type User, logoutApi } from '@features/auth';

const MAX_LOGIN_TIME = 10 * 60;

export function AuthProvider({ children }: { children: React.ReactNode }) {
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
      await logoutApi();
    } catch (error) {
      console.error('[AuthProvider] Logout API failed:', error);
    } finally {
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

  useEffect(() => {
    if (!user) return;
    extendLogin();
  }, [location, user, extendLogin]);

  useEffect(() => {
    if (!user) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          logout();
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [user, logout, navigate]);

  return (
    <AuthContext.Provider value={{ user, login, logout, timeLeft, extendLogin }}>
      {children}
    </AuthContext.Provider>
  );
}
