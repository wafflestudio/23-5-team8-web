import '../css/Warning.css';

export default function NotSupporting({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className='background'>
      {/* 모달 내부를 클릭했을 때는 닫히지 않도록 stopPropagation 사용 */}
      <div className='warningContainer'>
        <div className='contentWrapper'>
          <svg
            width='38'
            height='38'
            viewBox='0 0 50 50'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='warningIcon'
          >
            <circle cx='25' cy='25' r='25' fill='#FFF3E0' />
            <rect
              x='23.5'
              y='12'
              width='2'
              height='18'
              rx='1.5'
              fill='#FF9800'
            />
            <circle cx='25' cy='36' r='2' fill='#FF9800' />
          </svg>
          <p className='warningText'>지원하지 않는 기능입니다.</p>
        </div>
        <button className='confirmButton' onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
}
