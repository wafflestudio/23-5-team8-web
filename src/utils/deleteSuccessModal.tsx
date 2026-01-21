import { useEffect } from "react";
import "../css/needLogin.css";

interface DeleteSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteSuccessModal({
  isOpen,
  onClose,
}: DeleteSuccessModalProps) {
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
    <div className="login-modal-overlay">
      <div
        className="delete-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="login-modal-content">
          <div className="icon-wrapper-warning">
            <span className="warning-mark">
              !
            </span>
          </div>

          <h2 className="modal-title">
            삭제되었습니다.
          </h2>
        </div>

        <div className="delete-modal-button">
          <button
            className="btn-confirm-single"
            onClick={onClose}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
