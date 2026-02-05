import {createContext, useContext} from 'react';

export type LoginProvider = 'local' | 'kakao' | 'google';

export interface User {
  id: string;
  nickname: string;
  provider: LoginProvider;
  admin: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (userData: User, accessToken: string) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
