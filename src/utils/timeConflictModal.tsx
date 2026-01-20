import { useEffect } from "react";
import "../css/needLogin.css";

interface TimeConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  courseName: string;
  courseCode: string;
}

export default function TimeConflictModal({
  isOpen,
  onClose,
  onConfirm,
  courseName,
  courseCode,
}: TimeConflictModalProps) {
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
          <h2 className="modal-title-conflict">
            {courseName} ({courseCode}) :<br />
            수업교시가 중복되었습니다.
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
