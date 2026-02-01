import { createContext, useContext } from 'react';

export interface TimerContextType {
  timeLeft: number;
  extendLogin: () => void;
}

export const TimerContext = createContext<TimerContextType | undefined>(
  undefined
);

export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) throw new Error('useTimer must be used within a TimerProvider');
  return context;
}
