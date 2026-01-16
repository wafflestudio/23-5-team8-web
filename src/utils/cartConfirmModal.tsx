import "../css/needLogin.css";

interface CartConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
}

export default function CartConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  message = "장바구니에 추가하시겠습니까?",
}: CartConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="login-modal-overlay"
      onClick={onClose}
    >
      <div
        className="login-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="login-modal-content">
          <div className="icon-wrapper">
            <span className="question-mark">
              ?
            </span>
          </div>

          <p className="modal-text">
            {message
              .split("\n")
              .map((line, index) => (
                <span key={index}>
                  {line}
                  {index <
                    message.split("\n").length -
                      1 && <br />}
                </span>
              ))}
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
