import { useEffect, type ReactNode } from 'react';
import '../css/Warning.css';

type IconType = 'question' | 'warning' | 'none';

interface BaseWarningProps {
  isOpen: boolean;
  icon?: IconType;
  title?: string;
  subtitle?: string;
  children?: ReactNode;
}

interface SingleButtonProps extends BaseWarningProps {
  variant: 'single';
  onClose: () => void;
  confirmLabel?: string;
}

interface DoubleButtonProps extends BaseWarningProps {
  variant: 'double';
  onClose: () => void;
  onConfirm: () => void;
  cancelLabel?: string;
  confirmLabel?: string;
}

interface NoButtonProps extends BaseWarningProps {
  variant: 'none';
  containerClassName?: string;
}

type WarningProps = SingleButtonProps | DoubleButtonProps | NoButtonProps;

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

export default function Warning(props: WarningProps) {
  const { isOpen, icon = 'none', title, subtitle, children, variant } = props;

  const onClose = variant !== 'none' ? props.onClose : undefined;
  const confirmLabel = variant !== 'none' ? (props.confirmLabel ?? '확인') : '';
  const cancelLabel = variant === 'double' ? (props.cancelLabel ?? '취소') : '';
  const onConfirm = variant === 'double' ? props.onConfirm : undefined;
  const containerClassName =
    variant === 'none' ? props.containerClassName : undefined;

  // 스크롤 잠금 처리
  useEffect(() => {
    if (isOpen) {
      document.body.style.setProperty('overflow', 'hidden', 'important');
    } else {
      document.body.style.removeProperty('overflow');
    }

    return () => {
      document.body.style.removeProperty('overflow');
    };
  }, [isOpen]);

  // Enter, space bar로 버튼 작동 처리
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();

        if (variant === 'single' && onClose) {
          onClose();
        } else if (variant === 'double' && onClose) {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, variant, onClose, onConfirm]);

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

  const renderButtons = () => {
    if (variant === 'none') {
      return null;
    }

    if (variant === 'single') {
      return (
        <button className="confirmButton" onClick={onClose}>
          {confirmLabel}
        </button>
      );
    }

    return (
      <div className="success-btn-row">
        <button className="success-btn gray" onClick={onClose}>
          {cancelLabel}
        </button>
        <button className="success-btn blue" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    );
  };

  return (
    <div className="background">
      <div
        className={containerClassName ?? 'warningContainer'}
        onClick={(e) => e.stopPropagation()}
      >
        {variant === 'none' ? (
          children
        ) : (
          <>
            <div className="contentWrapper">
              {renderIcon()}
              {title && <h2 className="modal-title">{title}</h2>}
              {subtitle && <p className="modal-subtitle">{subtitle}</p>}
              {children}
            </div>
            {renderButtons()}
          </>
        )}
      </div>
    </div>
  );
}
