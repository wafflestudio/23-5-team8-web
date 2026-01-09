import React, {useState} from 'react';
import {AuthContext, type User} from './AuthContext';

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser) as User;
    } catch {
      localStorage.removeItem('userInfo');
      return null;
    }
  });

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
    localStorage.setItem('authToken', 'dummy-token-' + Date.now());
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    localStorage.removeItem('authToken');
    window.location.href = '/';
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{user, login, logout, isLoggedIn}}>
      {children}
    </AuthContext.Provider>
  );
}
