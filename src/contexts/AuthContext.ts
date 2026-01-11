import {createContext, useContext} from 'react';

export interface User {
  id: string;
  nickname: string;
}

export interface AuthContextType {
  user: User | null;
  login: (userData: User, accessToken: string) => void;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
  timeLeft: number;
  extendLogin: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
