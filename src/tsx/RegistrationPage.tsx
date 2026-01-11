import {useState, useEffect} from 'react';
import {createPortal} from 'react-dom';
import '../css/registration.css';

// Captcha 타입 정의
interface CaptchaDigit {
  value: string;
  rotation: number;
  yOffset: number;
  xOffset: number;
  color: string;
  fontSize: number;
}

// Captcha 생성 함수
function makeCaptchaDigits(): CaptchaDigit[] {
  const num1 = Math.floor(Math.random() * 10);
  const num2 = Math.floor(Math.random() * 10);
  const chars = [num1, num2];
  // 실제 사이트처럼 조금 더 진하고 보라/검정 계열의 색상
  const colors = ['#4a235a', '#154360', '#1b2631', '#78281f', '#0e6251'];

  return chars.map((char) => ({
    value: char.toString(),
    rotation: Math.random() * 30 - 15, // 회전 각도 조금 줄임
    yOffset: Math.random() * 6 - 3,
    xOffset: Math.random() * 6 - 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    fontSize: Math.floor(Math.random() * 5) + 24, // 폰트 크기 약간 키움
  }));
}

// 1. 시계 컴포넌트 (PiP 내부용)
const PracticeClock = () => {
  const [currentTime, setCurrentTime] = useState(
    new Date(2026, 0, 9, 8, 28, 0)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime((prev) => new Date(prev.getTime() + 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // [수정 1] 날짜의 '숫자'와 '한글'을 분리하여 렌더링
  // DSEG7 폰트는 한글을 지원하지 않으므로 숫자만 감싸야 함
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
            {/* [수정 2] 날짜 렌더링 방식 변경 */}
            <div className='utck-date-text'>{renderDate(currentTime)}</div>

            {/* 시간 영역 */}
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
};

export default function Registration() {
  const [pipWindow, setPipWindow] = useState<Window | null>(null);
  const [captchaDigits] = useState<CaptchaDigit[]>(() => makeCaptchaDigits());

  // PiP 창 열기/닫기 핸들러
  const togglePiP = async () => {
    if (pipWindow) {
      pipWindow.close();
      setPipWindow(null);
      return;
    }

    if (!('documentPictureInPicture' in window)) {
      alert(
        '이 브라우저는 Document Picture-in-Picture API를 지원하지 않습니다.'
      );
      return;
    }

    try {
      const TARGET_WIDTH = 380;
      const TARGET_HEIGHT = 230;

      // @ts-expect-error: 표준 API 미등록 이슈 대응
      const win = await window.documentPictureInPicture.requestWindow({
        width: TARGET_WIDTH,
        height: TARGET_HEIGHT,
      });

      win.document.title = 'utck 디자인 수강신청 연습 타이머';
      win.document.body.classList.add('pip-mode');

      win.addEventListener('resize', () => {
        // 브라우저에 따라 약간의 오차가 있을 수 있어 범위를 둡니다.
        if (
          win.innerWidth < TARGET_WIDTH - 2 ||
          win.innerWidth > TARGET_WIDTH + 2 ||
          win.innerHeight < TARGET_HEIGHT - 2 ||
          win.innerHeight > TARGET_HEIGHT + 2
        ) {
          win.resizeTo(TARGET_WIDTH, TARGET_HEIGHT);
        }
      });

      // 1. DSEG7 폰트 (디지털 시계 폰트) 직접 주입
      const style = win.document.createElement('style');
      style.textContent = `
        @font-face {
          font-family: 'MyDSEG7';
          src: url('/fonts/DSEG7.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
      `;
      win.document.head.appendChild(style);

      // 2. CSS 스타일 복사
      [...document.styleSheets].forEach((styleSheet) => {
        try {
          if (styleSheet.href) {
            const newLink = win.document.createElement('link');
            newLink.rel = 'stylesheet';
            newLink.href = styleSheet.href;
            win.document.head.appendChild(newLink);
          } else if (styleSheet.cssRules) {
            const cssRules = [...styleSheet.cssRules]
              .map((r) => r.cssText)
              .join('');
            const style = win.document.createElement('style');
            style.textContent = cssRules;
            win.document.head.appendChild(style);
          }
        } catch (e) {
          console.warn(e);
        }
      });

      win.addEventListener('pagehide', () => setPipWindow(null));
      setPipWindow(win);
    } catch (error) {
      console.error('PiP Error:', error);
    }
  };

  return (
    <div className='registrationPage'>
      <div className='containerX'>
        {/* 상단 타이틀 */}
        <div className='regHeader'>
          <h2 className='regTitle'>수강신청</h2>
        </div>

        {/* 탭 메뉴 */}
        <div className='regTabs'>
          <button className='regTabItem active'>장바구니 보류강좌</button>
          <button className='regTabItem'>관심강좌</button>
          <button className='regTabItem'>교과목검색</button>
          <button className='regTabItem'>교과목번호 검색</button>
        </div>

        {/* 학점 정보 라인 */}
        <div className='regInfoLine'>
          신청가능학점 <span className='infoNum'>21</span>학점 / 신청학점{' '}
          <span className='infoNum'>0</span>학점 / 신청강좌{' '}
          <span className='infoNum'>0</span>강좌
        </div>

        {/* 메인 컨텐츠 (2단 레이아웃) */}
        <div className='regContent'>
          {/* 왼쪽: 강좌 목록 영역 */}
          <div className='regLeftColumn'>
            {/* 진한 회색 구분선 */}
            <hr className='regDarkSeparator' />
            <div className='stateMessage'>
              장바구니에 남은 보류강좌가 없습니다.
            </div>
          </div>

          {/* 오른쪽: 플로팅 메뉴 (수강신청 버튼 & 연습버튼) */}
          <div className='regRightColumn'>
            <div className='regFloatingBox'>
              {/* 보안문자 + 입력창이 붙어있는 행 */}
              <div className='regCaptchaRow'>
                <div className='regCaptchaDisplay'>
                  {captchaDigits.map((digit, index) => (
                    <span
                      key={index}
                      className='regCaptchaDigit'
                      style={{
                        transform: `rotate(${digit.rotation}deg) translateY(${digit.yOffset}px) translateX(${digit.xOffset}px)`,
                        color: digit.color,
                        fontSize: `${digit.fontSize}px`,
                      }}
                    >
                      {digit.value}
                    </span>
                  ))}
                </div>
                <div className='regInputWrapper'>
                  <input className='regCaptchaInput' placeholder='입 력' />
                </div>
              </div>

              <button className='regSubmitBtn'>수강신청</button>
            </div>

            {/* 연습 모드 버튼 */}
            <div className='practiceArea'>
              <button
                className={`practiceToggleBtn ${pipWindow ? 'active' : ''}`}
                onClick={togglePiP}
              >
                {pipWindow ? '연습 종료 (Stop)' : '연습 모드 (Start)'}
              </button>
              <p className='practiceDesc'>
                * 실제 수강신청 전<br /> 서버시간 타이머를 띄워보세요.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PiP 포탈 */}
      {pipWindow && createPortal(<PracticeClock />, pipWindow.document.body)}
    </div>
  );
}
