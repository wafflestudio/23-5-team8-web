import { useEffect } from "react";
import "../css/Warning.css";

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
    <div className="background">
      <div
        className="warningContainer"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="contentWrapper">
          <div className="icon-wrapper-warning">
            <span className="warning-mark">
              !
            </span>
          </div>

          <h2 className="modal-title">
            삭제되었습니다.
          </h2>
        </div>

        <button
          className="confirmButton"
          onClick={onClose}
        >
          확인
        </button>
      </div>
    </div>
  );
}
