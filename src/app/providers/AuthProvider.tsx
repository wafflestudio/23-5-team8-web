import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext, type User, logoutApi } from '@features/auth';
import { setAuthToken, clearAuthToken } from '@shared/api/axios';

const MAX_LOGIN_TIME = 10 * 60;
const WARNING_THRESHOLD = 60;

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

  const timeLeftRef = useRef<number>(MAX_LOGIN_TIME);
  const [timeLeft, setTimeLeft] = useState<number>(MAX_LOGIN_TIME);

  const login = (userData: User, accessToken: string) => {
    setUser(userData);
    sessionStorage.setItem('userInfo', JSON.stringify(userData));
    setAuthToken(accessToken);
    timeLeftRef.current = MAX_LOGIN_TIME;
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
      clearAuthToken();
    }
  }, []);

  const extendLogin = useCallback(() => {
    if (user) {
      timeLeftRef.current = MAX_LOGIN_TIME;
      setTimeLeft(MAX_LOGIN_TIME);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    extendLogin();
  }, [location, user, extendLogin]);

  useEffect(() => {
    if (!user) return;

    timeLeftRef.current = MAX_LOGIN_TIME;

    const timer = setInterval(() => {
      timeLeftRef.current -= 1;
      const currentTime = timeLeftRef.current;

      if (currentTime <= 0) {
        clearInterval(timer);
        setTimeLeft(0);
        logout();
        navigate('/');
        return;
      }

      // Only update state at warning threshold or every 10 seconds during warning period
      if (currentTime === WARNING_THRESHOLD || (currentTime < WARNING_THRESHOLD && currentTime % 10 === 0)) {
        setTimeLeft(currentTime);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [user, logout, navigate]);

  return (
    <AuthContext.Provider value={{ user, login, logout, timeLeft, extendLogin }}>
      {children}
    </AuthContext.Provider>
  );
}
