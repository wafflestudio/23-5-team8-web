import { useEffect } from "react";
import "../css/needLogin.css";

interface CartConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CartConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: CartConfirmModalProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay">
      <div
        className="login-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="login-modal-content">
          <h2 className="modal-title">
            장바구니에 담겼습니다.
          </h2>
          <p className="modal-subtitle">
            지금 바로 장바구니로
            <br />
            이동하시겠습니까?
          </p>
        </div>

        <div className="login-modal-buttons">
          <button
            className="btn-cancel"
            onClick={onClose}
          >
            아니요, 괜찮습니다.
          </button>
          <button
            className="btn-confirm"
            onClick={onConfirm}
          >
            장바구니로 이동
          </button>
        </div>
      </div>
    </div>
  );
}
