import '../css/needLogin.css';

interface NeedLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function NeedLogin({
  isOpen,
  onClose,
  onConfirm,
}: NeedLoginProps) {
  if (!isOpen) return null;

  return (
    <div className='login-modal-overlay'>
      <div className='login-modal-box'>
        <div className='login-modal-content'>
          <div className='icon-wrapper'>
            <span className='question-mark'>?</span>
          </div>
          <p className='modal-text'>
            로그인 후 사용할 수 있는 기능입니다.
            <br />
            로그인하시겠습니까?
          </p>
        </div>
        <div className='login-modal-buttons'>
          <button className='btn-cancel' onClick={onClose}>
            취소
          </button>
          <button className='btn-confirm' onClick={onConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
