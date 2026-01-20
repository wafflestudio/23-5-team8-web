import '../css/needLogin.css';

interface NeedLoginProps {
  isOpen: boolean; // 모달 표시 여부
  onClose: () => void; // '취소' 버튼 또는 배경 클릭 시 실행
  onConfirm: () => void; // '확인' 버튼 클릭 시 실행 (로그인 페이지 이동 등)
}

export default function NeedLogin({
  isOpen,
  onClose,
  onConfirm,
}: NeedLoginProps) {
  // 열려있지 않으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className='login-modal-overlay'>
      {/* 모달 내부를 클릭했을 때는 닫히지 않도록 stopPropagation 사용 */}
      <div className='login-modal-box'>
        <div className='login-modal-content'>
          {/* 물음표 아이콘 영역 */}
          <div className='icon-wrapper'>
            <span className='question-mark'>?</span>
          </div>

          {/* 텍스트 영역 */}
          <p className='modal-text'>
            로그인 후 사용할 수 있는 기능입니다.
            <br />
            로그인하시겠습니까?
          </p>
        </div>

        {/* 버튼 영역 */}
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
