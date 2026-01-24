import { useEffect } from "react";
import "../css/Warning.css";

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
    document.body.style.overflow = isOpen
      ? "hidden"
      : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="background">
      <div
        className="warningContainer"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="contentWrapper">
          <h2 className="modal-title">
            장바구니에 담겼습니다.
          </h2>
          <p className="modal-subtitle">
            지금 바로 장바구니로
            <br />
            이동하시겠습니까?
          </p>
        </div>

        <div className="success-btn-row">
          <button
            className="success-btn gray"
            onClick={onClose}
          >
            아니요, 괜찮습니다.
          </button>
          <button
            className="success-btn blue"
            onClick={onConfirm}
          >
            장바구니로 이동
          </button>
        </div>
      </div>
    </div>
  );
}
