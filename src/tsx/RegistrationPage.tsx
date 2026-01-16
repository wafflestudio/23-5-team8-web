import {useState, useEffect, useRef} from 'react';
import {createPortal} from 'react-dom';
import '../css/registrationPage.css';
import showNotSupportedToast from '../utils/notSupporting';
import {
  practiceStartApi,
  practiceEndApi,
  practiceAttemptApi,
} from '../api/registration';
import {isAxiosError} from 'axios';

// Captcha 타입 정의
interface CaptchaDigit {
  value: string;
  rotation: number;
  yOffset: number;
  xOffset: number;
  color: string;
  fontSize: number;
}

interface CourseData {
  id: number;
  type: string; // 이수구분 (전선, 전필 등)
  title: string; // 강좌명
  professor: string; // 교수명
  department: string; // 개설학과
  currentStd: number; // 신청인원
  maxStd: number; // 정원
  maxStd_current: number; // 정원(재학생)
  credit: number; // 학점
  schedule: string; // 강의시간
  cartCount: number; // 장바구니 담은 수
}

const COURSE_MOCK_DATA: CourseData[] = [
  {
    id: 1,
    type: '전선',
    title: '모바일 컴퓨팅과 응용',
    professor: '이영기',
    department: '컴퓨터공학부',
    currentStd: 0,
    maxStd: 40,
    maxStd_current: 40,
    credit: 3,
    schedule: '화(11:00~12:15) 목(11:00~12:15)',
    cartCount: 46,
  },

  {
    id: 2,
    type: '교양',
    title: '글쓰기의 기초',
    professor: '김서울',
    department: '기초교육원',
    currentStd: 12,
    maxStd: 20,
    maxStd_current: 20,
    credit: 3,
    schedule: '화(14:00~15:15) 목(14:00~15:15)',
    cartCount: 38,
  },
];

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
const PracticeClock = ({currentTime}: {currentTime: Date}) => {
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
  const [courseList] = useState<CourseData[]>(COURSE_MOCK_DATA);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [selectedCourseTotalCompetitors, setSelectedCourseTotalCompetitors] =
    useState<number>(0);
  const [selectedCourseCapacity, setSelectedCourseCapacity] =
    useState<number>(0);
  const [captchaInput, setCaptchaInput] = useState('');
  const [currentTime, setCurrentTime] = useState<Date>(() => {
    const now = new Date();
    now.setHours(8, 28, 0, 0); // 기본값 8:28
    return now;
  });

  const timerRef = useRef<number | undefined>(undefined);
  const isPracticeRunningRef = useRef(false);

  const handleSelectedCourse = (
    courseId: number,
    currentStd: number,
    maxStd_current: number,
    cartCount: number
  ) => {
    if (selectedCourse === courseId) {
      setSelectedCourse(null);
    } else {
      setSelectedCourse(courseId);
      setSelectedCourseTotalCompetitors(cartCount);
      setSelectedCourseCapacity(maxStd_current - currentStd);
    }
  };

  // PiP 창 닫기 및 타이머 정지 (연습 종료 공통 로직)
  const handleStopPractice = async (isManual = false) => {
    if (!isPracticeRunningRef.current) return;
    isPracticeRunningRef.current = false;

    // 1. 타이머 정지
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = undefined;
    }

    // 2. PiP 창 닫기
    if (pipWindow) {
      pipWindow.close();
      setPipWindow(null);
    }

    // 3. 종료 API 호출 및 에러 처리
    try {
      await practiceEndApi();
      if (!isManual) {
        alert('연습 시간이 종료되었습니다! (08:33)');
      }
    } catch (error) {
      console.error('연습 종료 오류:', error);
      if (isAxiosError(error) && error.response) {
        alert(
          `연습 종료 실패: ${error.response.data.message || '알 수 없는 오류'}`
        );
      } else {
        alert('연습 종료 중 네트워크 오류가 발생했습니다.');
      }
    }
  };

  // PiP 창 열기 로직 (UI 관련만 담당)
  const openPiPWindow = async () => {
    if (!('documentPictureInPicture' in window)) {
      alert(
        '이 브라우저는 Document Picture-in-Picture API를 지원하지 않습니다.'
      );
      return null;
    }

    try {
      const TARGET_WIDTH = 380;
      const TARGET_HEIGHT = 230;

      // @ts-expect-error: 표준 API 미등록 이슈 대응
      const win = await window.documentPictureInPicture.requestWindow({
        width: TARGET_WIDTH,
        height: TARGET_HEIGHT,
      });

      // 스타일 주입
      win.document.title = 'utck 디자인 수강신청 연습 타이머';
      win.document.body.classList.add('pip-mode');

      // 폰트 및 스타일 복사 로직
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

      win.addEventListener('pagehide', () => {
        setPipWindow(null);
        if (isPracticeRunningRef.current) {
          handleStopPractice(true);
        }
      });

      return win;
    } catch (error) {
      console.error('PiP Error:', error);
      return null;
    }
  };

  // 연습 시작 핸들러 (API 호출 -> 성공 -> PiP 오픈 -> 타이머 시작)
  // 연습 시작 핸들러 (수정됨: 409 에러 자동 복구 추가)
  const handleStartPractice = async () => {
    try {
      // 1. API 호출 시도
      await practiceStartApi();

      // (성공 시 실행되는 로직은 아래로 이동)
      startTimerAndPip();
    } catch (error) {
      // 409 Conflict (이미 세션이 존재함) 에러 처리
      if (isAxiosError(error) && error.response?.status === 409) {
        console.warn('기존 세션이 감지되어 종료 후 재시작합니다.');

        try {
          // 강제로 종료 API 호출하여 좀비 세션 정리
          await practiceEndApi();

          // 다시 시작 요청
          await practiceStartApi();

          // 재시도 성공 시 타이머/PiP 시작
          startTimerAndPip();
        } catch (retryError) {
          console.error('재시도 실패:', retryError);
          alert('연습 모드를 시작할 수 없습니다. 잠시 후 다시 시도해주세요.');
        }
      } else {
        // 그 외 에러 처리
        console.error('연습 시작 오류:', error);
        if (isAxiosError(error) && error.response) {
          alert(
            `연습 시작 실패: ${
              error.response.data.message || '알 수 없는 오류'
            }`
          );
        } else {
          alert('연습 시작 중 네트워크 오류가 발생했습니다.');
        }
      }
    }
  };

  // 수강신청 시도 핸들러
  const handleRegisterAttempt = async () => {
    // 1. 유효성 검사: 강의 선택 여부 (최우선 순위 - 5번째 화면)
    if (selectedCourse === null) {
      alert('신청할 강좌를 선택하시기 바랍니다.');
      return;
    }

    // 2. 유효성 검사: 보안문자 일치 여부 (4번째 화면)
    // captchaDigits 배열의 value를 합쳐 정답 문자열 생성
    const correctCaptcha = captchaDigits.map((d) => d.value).join('');

    if (captchaInput !== correctCaptcha) {
      alert(
        '보안문자가 일치하지 않습니다.\n(입력된 문자가 생성된 보안문자와 다릅니다.)'
      );
      setCaptchaInput(''); // 틀렸을 경우 편의를 위해 입력창 초기화
      return;
    }

    // 3. 연습 모드 실행 여부 확인 (선택 사항)
    if (!pipWindow) {
      alert('연습 모드(Start)를 먼저 실행해주세요.');
      return;
    }

    // 1. 유효성 검사: 강의 선택 여부 (최우선 순위 - 1순위)
    if (selectedCourse === null) {
      // 5번째 화면(강의 미선택 알림)에 해당
      alert('신청할 강좌를 선택하시기 바랍니다.');
      return;
    }

    if (captchaInput !== correctCaptcha) {
      alert(
        '보안문자가 일치하지 않습니다.\n(입력된 문자가 생성된 보안문자와 다릅니다.)'
      );
      setCaptchaInput(''); // 입력창 초기화
      return;
    }

    // [디버깅] 실제 서버로 전송되는 데이터 확인 (개발자 도구 Console 확인)
    const payload = {
      courseId: selectedCourse,
      totalCompetitors: selectedCourseTotalCompetitors,
      capacity: selectedCourseCapacity,
    };
    console.log('서버로 전송하는 데이터:', payload);

    // 4. API 호출
    try {
      const payload = {
        courseId: Number(selectedCourse),
        totalCompetitors: Number(selectedCourseTotalCompetitors),
        capacity: Number(selectedCourseCapacity),
      };

      console.log('최종 전송 데이터:', payload);

      await practiceAttemptApi(payload);

      // 성공 시 처리
      alert('수강신청되었습니다.');

      // (선택) 성공 후 입력창 초기화나 선택 해제 등 후속 처리
      setCaptchaInput('');
      setSelectedCourse(null);
      setSelectedCourseTotalCompetitors(0);
      setSelectedCourseCapacity(0);
    } catch (error) {
      console.error('수강신청 실패:', error);

      if (isAxiosError(error) && error.response) {
        // 서버에서 보내주는 에러 메시지 출력
        alert(error.response.data.message || '수강신청에 실패했습니다.');
      } else {
        alert('수강신청 요청 중 오류가 발생했습니다.');
      }
    }
  };

  // 타이머와 PiP를 켜는 로직을 별도 함수로 분리 (중복 제거)
  const startTimerAndPip = async () => {
    // 시간 초기화 (8시 28분)
    const startTime = new Date();
    startTime.setHours(8, 28, 0, 0);
    setCurrentTime(startTime);
    isPracticeRunningRef.current = true; // 실행 상태 플래그 true 설정

    // PiP 창 열기
    const win = await openPiPWindow();
    if (win) {
      setPipWindow(win);
    }
  };

  // 버튼 클릭 핸들러 (Toggle)
  const togglePractice = () => {
    if (pipWindow) {
      // 이미 실행 중이면 종료 로직
      handleStopPractice(true); // true = 수동 종료(API 호출 포함)
    } else {
      // 실행 중 아니면 시작 로직
      handleStartPractice();
    }
  };

  useEffect(() => {
    return () => {
      // 1. 타이머 정리 (메모리 누수 방지)
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // 2. PiP 창 닫기
      // 중요: 여기서 setPipWindow(null)을 호출하지 않습니다.
      // 컴포넌트가 이미 사라지는 중이므로 상태 업데이트는 불필요합니다.
      if (pipWindow && !pipWindow.closed) {
        pipWindow.close();
      }
    };
  }, [pipWindow]);

  // [추가] PiP 창 상태에 따라 타이머를 자동으로 켜고 끄는 Effect
  useEffect(() => {
    // PiP 창이 없으면 타이머를 돌리지 않음
    if (!pipWindow) return;

    // 기존 타이머 정리 (중복 방지)
    if (timerRef.current) clearInterval(timerRef.current);

    // 타이머 시작 (window.setInterval 명시)
    timerRef.current = window.setInterval(() => {
      setCurrentTime((prev) => {
        const nextTime = new Date(prev.getTime() + 1000);

        // 8시 33분 체크 (자동 종료)
        if (
          nextTime.getHours() === 8 &&
          nextTime.getMinutes() === 33 &&
          nextTime.getSeconds() === 0
        ) {
          handleStopPractice(false);
        }
        return nextTime;
      });
    }, 1000);

    // Cleanup: 창이 닫히거나 컴포넌트가 사라질 때 타이머 정지
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [pipWindow]); // pipWindow가 변할 때마다 실행됨

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
          <button className='regTabItem' onClick={showNotSupportedToast}>
            관심강좌
          </button>
          <button className='regTabItem' onClick={showNotSupportedToast}>
            교과목검색
          </button>
          <button className='regTabItem' onClick={showNotSupportedToast}>
            교과목번호 검색
          </button>
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
            {courseList.length === 0 ? (
              <div className='stateMessage'>
                장바구니에 남은 보류강좌가 없습니다.
              </div>
            ) : (
              <div className='courseListContainer'>
                {courseList.map((course) => {
                  const isSelected = selectedCourse === course.id;

                  return (
                    <div key={course.id} className='courseItem'>
                      {/* 1. 체크박스 영역 */}
                      <div className='courseCheckArea'>
                        <button
                          className={`customCheckBtn ${
                            isSelected ? 'checked' : ''
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectedCourse(
                              course.id,
                              course.currentStd,
                              course.maxStd_current,
                              course.cartCount
                            );
                          }}
                        >
                          <svg
                            viewBox='0 0 24 24'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                            className='checkIcon'
                          >
                            <path
                              d='M4 12L9 17L20 6'
                              strokeWidth='3'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                        </button>
                      </div>

                      {/* 2. 강좌 정보 영역 */}
                      <div className='courseInfoArea'>
                        <div className='infoRow top'>
                          <span className='c-type'>[{course.type}]</span>
                          <span className='c-title'>{course.title}</span>
                        </div>
                        <div className='infoRow middle'>
                          <span className='c-prof'>{course.professor}</span>
                          <span className='c-divider'>|</span>
                          <span className='c-dept'>{course.department}</span>
                        </div>
                        <div className='infoRow bottom'>
                          <span className='c-label'>
                            수강신청인원/정원(재학생)
                          </span>
                          <span className='c-val-blue'>
                            {course.currentStd}/{course.maxStd}(
                            {course.maxStd_current})
                          </span>
                          <span className='c-divider-light'>|</span>
                          <span className='c-label'>학점</span>
                          <span className='c-val-blue'>{course.credit}</span>
                          <span className='c-divider-light'>|</span>
                          <span className='c-schedule'>{course.schedule}</span>
                        </div>
                      </div>

                      {/* 3. 우측 장바구니/이동 영역 */}
                      <div className='courseActionArea'>
                        <div className='cartInfoBox'>
                          {/* [수정] 장바구니 아이콘 (3번 사진 스타일) - 단순 외곽선 */}
                          <svg
                            className='cartIconSvg'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          >
                            <circle cx='9' cy='21' r='1'></circle>
                            <circle cx='20' cy='21' r='1'></circle>
                            <path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6'></path>
                          </svg>
                          <span
                            className={`cartCountNum ${
                              course.cartCount >
                              course.maxStd - course.currentStd
                                ? 'red'
                                : ''
                            }`}
                          >
                            {course.cartCount}
                          </span>
                        </div>
                        <div className='arrowBox'>
                          <svg
                            width='12'
                            height='12'
                            viewBox='0 0 10 18'
                            fill='none'
                          >
                            <path
                              d='M1 1L9 9L1 17'
                              stroke='#000000'
                              strokeWidth='1'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
                  <input
                    className='regCaptchaInput'
                    placeholder='입 력'
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                  />
                </div>
              </div>

              <button className='regSubmitBtn' onClick={handleRegisterAttempt}>
                수강신청
              </button>
            </div>

            {/* 연습 모드 버튼 */}
            <div className='practiceArea'>
              <button
                className={`practiceToggleBtn ${pipWindow ? 'active' : ''}`}
                onClick={togglePractice}
              >
                {pipWindow ? '연습 종료 (Stop)' : '연습 모드 (Start)'}
              </button>
              <p className='practiceDesc'>
                * 연습 모드를 시작하면 <br /> 8시 28분부터 시계가 시작됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PiP 포탈 */}
      {pipWindow &&
        createPortal(
          <PracticeClock currentTime={currentTime} />,
          pipWindow.document.body
        )}
    </div>
  );
}
