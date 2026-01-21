interface PracticeClockProps {
  currentTime: Date;
}

export default function PracticeClock({currentTime}: PracticeClockProps) {
  const renderDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const weekDay = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];

    return (
      <>
        <span className='seg-text small'>{year}</span>
        <span className='kor-text'>년 </span>
        <span className='seg-text small'>{month}</span>
        <span className='kor-text'>월 </span>
        <span className='seg-text small'>{day}</span>
        <span className='kor-text'>일 </span>
        <span className='kor-text'>{weekDay}요일</span>
      </>
    );
  };

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className='utck-window'>
      <div className='utck-body'>
        <div className='utck-top-buttons'>
          <button className='utck-btn'>세계시</button>
          <button className='utck-btn'>설 정</button>
          <button className='utck-btn'>도움말</button>
          <button className='utck-btn'>숨기기</button>
        </div>

        <div className='utck-lcd-frame'>
          <div className='utck-lcd-screen'>
            <div className='utck-date-text'>{renderDate(currentTime)}</div>
            <div className='utck-time-container'>
              <span className='utck-time-fg'>{formatTime(currentTime)}</span>
            </div>
          </div>
          <div className='utck-side-buttons'>
            <button className='utck-btn side'>비 교</button>
            <button className='utck-btn side'>동 기</button>
          </div>
        </div>

        <div className='utck-message-bar'>서버에 시각이 동기되었습니다.</div>

        <div className='utck-logo-area'>
          <span className='utck-logo-kriss'>SNU</span>
          <span className='utck-logo-text'>수강신청 연습</span>
        </div>
      </div>
    </div>
  );
}
