import type { ReactNode } from 'react';
import { useModalEffects } from '../hooks/useModalEffects';
import '../warning.css';

type IconType = 'question' | 'warning' | 'none';

interface AlertProps {
  isOpen: boolean;
  onClose: () => void;
  icon?: IconType;
  title?: string;
  subtitle?: string;
  confirmLabel?: string;
  children?: ReactNode;
}

function QuestionIcon() {
  return (
    <div className="icon-wrapper">
      <span className="question-mark">?</span>
    </div>
  );
}

function WarningIcon() {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="warningIcon"
    >
      <circle cx="25" cy="25" r="25" fill="#FFF3E0" />
      <rect x="23.5" y="12" width="2" height="18" rx="1.5" fill="#FF9800" />
      <circle cx="25" cy="36" r="2" fill="#FF9800" />
    </svg>
  );
}

export function Alert({
  isOpen,
  onClose,
  icon = 'none',
  title,
  subtitle,
  confirmLabel = '확인',
  children,
}: AlertProps) {
  useModalEffects({ isOpen, variant: 'single', onClose });

  if (!isOpen) return null;

  const renderIcon = () => {
    switch (icon) {
      case 'question':
        return <QuestionIcon />;
      case 'warning':
        return <WarningIcon />;
      default:
        return null;
    }
  };

  return (
    <div className="background">
      <div className="warningContainer" onClick={(e) => e.stopPropagation()}>
        <div className="contentWrapper">
          {renderIcon()}
          {title && <h2 className="modal-title">{title}</h2>}
          {subtitle && <p className="modal-subtitle">{subtitle}</p>}
          {children}
        </div>
        <button className="confirmButton" onClick={onClose}>
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}
