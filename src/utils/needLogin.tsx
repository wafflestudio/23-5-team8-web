import '../css/Warning.css';

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
    <div className='background'>
      <div className='warningContainer'>
        <div className='contentWrapper'>
          <div className='icon-wrapper'>
            <span className='question-mark'>?</span>
          </div>
          <p className='warningText'>
            로그인 후 사용할 수 있는 기능입니다.
            <br />
            로그인하시겠습니까?
          </p>
        </div>
        <div className='success-btn-row'>
          <button className='success-btn gray' onClick={onClose}>
            취소
          </button>
          <button className='success-btn blue' onClick={onConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
