import type { ReactNode } from 'react';
import { useModalEffects } from '../hooks/useModalEffects';
import '../warning.css';

interface CustomProps {
  isOpen: boolean;
  containerClassName?: string;
  children: ReactNode;
}

export function Custom({
  isOpen,
  containerClassName,
  children,
}: CustomProps) {
  useModalEffects({ isOpen, variant: 'none' });

  if (!isOpen) return null;

  return (
    <div className="background">
      <div
        className={containerClassName ?? 'warningContainer'}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
