import { useEffect } from 'react';

type VariantType = 'single' | 'double' | 'none';

interface UseModalEffectsOptions {
  isOpen: boolean;
  variant: VariantType;
  onClose?: () => void;
  onConfirm?: () => void;
}

export function useModalEffects({
  isOpen,
  variant,
  onClose,
  onConfirm,
}: UseModalEffectsOptions) {
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

        if (variant === 'double' && onConfirm) {
          onConfirm();
        } else if (variant === 'single' && onClose) {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, variant, onClose, onConfirm]);
}
