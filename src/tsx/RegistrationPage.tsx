import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import '../css/registrationPage.css';
import Warning from '../utils/Warning';
import {
  practiceStartApi,
  practiceEndApi,
  practiceAttemptApi,
} from '../api/registration';
import { isAxiosError } from 'axios';
import type {
  CourseDetailResponse,
  VirtualStartTimeOption,
} from '../types/apiTypes';
import { useCartQuery } from '../hooks/useCartQuery';
import { useModalStore } from '../stores/modalStore';
import {
  type WarningType,
  WarningModal,
  WaitingModal,
  SuccessModal,
} from './RegistrationWarning';
import { calculateQueueInfo } from '../utils/RegistrationUtils';
import PracticeClock from './PracticeClock';
import { usePracticeWindow } from '../hooks/usePracticeWindow';

interface CaptchaDigit {
  value: string;
  rotation: number;
  yOffset: number;
  xOffset: number;
  color: string;
  fontSize: number;
}

interface CourseData {
  preEnrollId: number;
  course: CourseDetailResponse;
  cartCount: number;
}

interface SelectedCourseInfo {
  totalCompetitors: number;
  capacity: number;
  title: string;
  courseNumber: string;
  lectureNumber: string;
}

function makeCaptchaDigits(): CaptchaDigit[] {
  const num1 = Math.floor(Math.random() * 10);
  const num2 = Math.floor(Math.random() * 10);
  const chars = [num1, num2];
  const colors = ['#4a235a', '#154360', '#1b2631', '#78281f', '#0e6251'];

  return chars.map((char) => ({
    value: char.toString(),
    rotation: Math.random() * 30 - 15,
    yOffset: Math.random() * 6 - 3,
    xOffset: Math.random() * 6 - 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    fontSize: Math.floor(Math.random() * 5) + 24,
  }));
}

export default function Registration() {
  const { pipWindow, openWindow, closeWindow } = usePracticeWindow();
  const { showNotSupported, openNotSupported, closeNotSupported } =
    useModalStore();

  const { data: cartData } = useCartQuery(true);
  const courseList: CourseData[] | null = cartData
    ? cartData.map((item) => ({
        preEnrollId: item.preEnrollId,
        course: item.course,
        cartCount: item.cartCount,
      }))
    : null;

  const [captchaDigits, setCaptchaDigits] = useState<CaptchaDigit[]>(() =>
    makeCaptchaDigits()
  );
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedCourseInfo, setSelectedCourseInfo] =
    useState<SelectedCourseInfo | null>(null);
  const [captchaInput, setCaptchaInput] = useState('');
  const [currentTime, setCurrentTime] = useState<Date>(() => {
    const now = new Date();
    now.setHours(8, 29, 30, 0);
    return now;
  });
  const [startOffset, setStartOffset] = useState<number>(0);
  const [warningType, setWarningType] = useState<WarningType>('none');
  const [waitingInfo, setWaitingInfo] = useState<{
    count: number;
    seconds: number;
  } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [succeededCourseIds, setSucceededCourseIds] = useState<Set<number>>(
    new Set()
  );
  const [fullCourseIds, setFullCourseIds] = useState<Set<number>>(new Set());

  const navigate = useNavigate();
  const practiceState = useRef({
    timerId: undefined as number | undefined,
    isRunning: false,
    startTime: 0,
    virtualOffset: 0,
  });

  const handleSelectedCourse = (
    courseId: number,
    currentStd: number,
    maxStd_current: number,
    cartCount: number,
    courseTitle: string,
    courseNumber: string,
    lectureNumber: string
  ) => {
    if (selectedCourseId === courseId) {
      setSelectedCourseId(null);
      setSelectedCourseInfo(null);
    } else {
      setSelectedCourseId(courseId);
      setSelectedCourseInfo({
        totalCompetitors: cartCount,
        capacity: maxStd_current - currentStd,
        title: courseTitle,
        courseNumber: courseNumber,
        lectureNumber: lectureNumber,
      });
    }
  };

  const handleStopPractice = useCallback(
    async (isManual = false) => {
      if (!practiceState.current.isRunning) return;
      practiceState.current.isRunning = false;

      if (practiceState.current.timerId) {
        clearInterval(practiceState.current.timerId);
        practiceState.current.timerId = undefined;
      }

      closeWindow();

      try {
        await practiceEndApi();
        if (!isManual) {
          alert('연습 시간이 종료되었습니다! (08:33)');
        }
      } catch (error) {
        if (isAxiosError(error) && error.response) {
          alert(
            `연습 종료 실패: ${error.response.data.message || '알 수 없는 오류'}`
          );
        } else {
          alert('연습 종료 중 네트워크 오류가 발생했습니다.');
        }
      }
    },
    [closeWindow]
  );

  const getTimeOption = (offset: number): VirtualStartTimeOption => {
    const optionMap: Record<number, VirtualStartTimeOption> = {
      60: 'TIME_08_29_00',
      30: 'TIME_08_29_30',
      15: 'TIME_08_29_45',
    };
    return optionMap[offset] || 'TIME_08_29_30';
  };

  const handleStartPractice = async () => {
    try {
      const virtualStartTimeOption = getTimeOption(startOffset);
      await practiceStartApi({ virtualStartTimeOption });

      setSucceededCourseIds(new Set());
      setFullCourseIds(new Set());


      startTimerAndPip();
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        if (error.response.status === 409) {
          // Already practicing - auto-recover by ending current session
          try {
            await practiceEndApi();
            const virtualStartTimeOption = getTimeOption(startOffset);

            await practiceStartApi({ virtualStartTimeOption });


            startTimerAndPip();
          } catch {
            alert('이미 연습 중인 상태를 종료하는 데 실패했습니다.');
          }
        } else {
          alert(
            `연습 시작 실패: ${error.response.data.message || '알 수 없는 오류'}`
          );
        }
      } else {
        alert('연습 시작 중 네트워크 오류가 발생했습니다.');
      }
    }
  };

  const handleRegisterAttempt = async () => {
    if (!pipWindow) {
      setWarningType('practiceNotStarted');
      setCaptchaInput('');
      setSelectedCourseId(null);
      setSelectedCourseInfo(null);
      setCaptchaDigits(makeCaptchaDigits());
      return;
    }

    if (selectedCourseId === null) {
      setWarningType('notChosen');
      setCaptchaInput('');
      setCaptchaDigits(makeCaptchaDigits());
      return;
    }

    const correctCaptcha = captchaDigits.map((d) => d.value).join('');
    setCaptchaDigits(makeCaptchaDigits());
    if (captchaInput !== correctCaptcha) {
      setWarningType('captchaError');
      setCaptchaInput('');
      setSelectedCourseId(null);
      setSelectedCourseInfo(null);
      return;
    }

    const targetTime = new Date(currentTime);
    targetTime.setHours(8, 30, 0, 0);

    const diffMs = currentTime.getTime() - targetTime.getTime();

    if (diffMs < 0) {
      setWarningType('beforeTime');
      setCaptchaInput('');
      setSelectedCourseId(null);
      setSelectedCourseInfo(null);
      return;
    }

    if (succeededCourseIds.has(selectedCourseId)) {
      setWarningType('alreadyAttempted');
      setCaptchaInput('');
      setSelectedCourseId(null);
      setSelectedCourseInfo(null);
      return;
    }

    if (fullCourseIds.has(selectedCourseId)) {
      setWarningType('quotaOver');
      setCaptchaInput('');
      setSelectedCourseId(null);
      setSelectedCourseInfo(null);
      return;
    }

    const queueData = calculateQueueInfo(diffMs);

    if (queueData.queueCount > 0) {
      setWaitingInfo({
        count: queueData.queueCount,
        seconds: queueData.waitSeconds,
      });
    } else {
      proceedToApiCall();
    }
  };

  const proceedToApiCall = async () => {
    setWaitingInfo(null);

    try {
      const payload = {
        courseId: selectedCourseId!,
        totalCompetitors: selectedCourseInfo!.totalCompetitors,
        capacity: selectedCourseInfo!.capacity,
      };

      const response = await practiceAttemptApi(payload);
      setCaptchaInput('');
      setSelectedCourseId(null);

      if (!response.data.isSuccess) {
        setWarningType('quotaOver');
        if (selectedCourseId) {
          setFullCourseIds((prev) => new Set(prev).add(selectedCourseId));
        }
      } else {
        setShowSuccessModal(true);
        if (selectedCourseId) {
          setSucceededCourseIds((prev) => new Set(prev).add(selectedCourseId));
        }
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        alert(error.response.data.message || '수강신청에 실패했습니다.');
      } else {
        alert('수강신청 요청 중 오류가 발생했습니다.');
      }
    }
  };

  const handleSuccessClose = (move: boolean) => {
    setShowSuccessModal(false);
    if (move) {
      navigate('/enrollment-history');
      setCaptchaInput('');
    } else {
      setSelectedCourseId(null);
      setSelectedCourseInfo(null);
      setCaptchaInput('');
    }
  };

  const handleToggleWithCooldown = () => {
    if (isCooldown) return;

    if (pipWindow) {
      handleStopPractice(true);
    } else {
      handleStartPractice();
    }

    setIsCooldown(true);

    setTimeout(() => {
      setIsCooldown(false);
    }, 1500);
  };

  const startTimerAndPip = async () => {
    const offsetSeconds = startOffset === 0 ? 30 : startOffset;
    const virtualStart = new Date();
    virtualStart.setHours(8, 30, 0, 0);
    virtualStart.setSeconds(virtualStart.getSeconds() - offsetSeconds);

    practiceState.current.startTime = Date.now();
    practiceState.current.virtualOffset = virtualStart.getTime();

    setCurrentTime(virtualStart);
    practiceState.current.isRunning = true;
    openWindow();
  };

  // PIP 창이 열리면 타이머 시작
  useEffect(() => {
    if (!pipWindow) return;

    const state = practiceState.current;

    if (state.timerId) clearInterval(state.timerId);

    state.timerId = window.setInterval(() => {
      const now = Date.now();
      const elapsed = now - state.startTime;
      const nextTime = new Date(state.virtualOffset + elapsed);

      setCurrentTime(nextTime);

      if (nextTime.getHours() === 8 && nextTime.getMinutes() >= 33) {
        handleStopPractice(false);
      }
    }, 1000);

    return () => {
      if (state.timerId) {
        clearInterval(state.timerId);
      }
      if (!pipWindow.closed) {
        pipWindow.close();
      }
    };
  }, [pipWindow, handleStopPractice]);

  // 페이지 이동 시 연습 종료
  useEffect(() => {
    return () => {
      if (practiceState.current.isRunning) {
        if (practiceState.current.timerId) {
          clearInterval(practiceState.current.timerId);
        }

        practiceState.current.isRunning = false;

        practiceEndApi().catch((error) => {
          console.error('세션 자동 종료 실패:', error);
        });
      }
    };
  }, []);

  return (
    <div className="registrationPage">
      <div className="containerX">
        <div className="regHeader">
          <h2 className="regTitle">수강신청</h2>
        </div>

        <div className="regTabs">
          <button className="regTabItem active">장바구니 보류강좌</button>
          <button className="regTabItem" onClick={openNotSupported}>
            관심강좌
          </button>
          <button className="regTabItem" onClick={openNotSupported}>
            교과목검색
          </button>
          <button className="regTabItem" onClick={openNotSupported}>
            교과목번호 검색
          </button>
          <p className="regTabInfoText">
            ※ 장바구니 탭에서 담은 수를 수정할 수 있습니다.
          </p>
        </div>

        <div className="regInfoLine">
          신청가능학점 <span className="infoNum">21</span>학점 / 신청학점{' '}
          <span className="infoNum">0</span>학점 / 신청강좌{' '}
          <span className="infoNum">0</span>강좌
        </div>

        <div className="regContent">
          <div className="regLeftColumn">
            <hr className="regDarkSeparator" />
            {courseList?.length === 0 ? (
              <div className="stateMessage">
                장바구니에 남은 보류강좌가 없습니다.
              </div>
            ) : (
              <div className="courseListContainer">
                {courseList?.map((c) => {
                  const isSelected = selectedCourseId === c.course.id;

                  return (
                    <div key={c.course.id} className="courseItem">
                      <div
                        className="courseCheckArea"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectedCourse(
                            c.course.id,
                            0,
                            c.course.quota,
                            c.cartCount,
                            c.course.courseTitle,
                            c.course.courseNumber,
                            c.course.lectureNumber || ''
                          );
                        }}
                      >
                        <button
                          className={`customCheckBtn ${
                            isSelected ? 'checked' : ''
                          }`}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="checkIcon"
                          >
                            <path
                              d="M4 12L9 17L20 6"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="courseInfoArea">
                        <div className="infoRow top">
                          <span className="c-type">
                            [{c.course.classification}]
                          </span>
                          <span className="c-title">
                            {c.course.courseTitle}
                          </span>
                        </div>
                        <div className="infoRow middle">
                          <span className="c-prof">{c.course.instructor}</span>
                          <span className="c-divider">|</span>
                          <span className="c-dept">{c.course.department}</span>
                        </div>
                        <div className="infoRow bottom">
                          <span className="c-label">
                            수강신청인원/정원(재학생)
                          </span>
                          <span className="c-val-blue">
                            0/{c.course.quota}(
                            {c.course.quota - c.course.freshmanQuota})
                          </span>
                          <span className="c-divider-light">|</span>
                          <span className="c-label">학점</span>
                          <span className="c-val-blue">{c.course.credit}</span>
                          <span className="c-divider-light">|</span>
                          <span className="c-schedule">
                            {c.course.placeAndTime
                              ? JSON.parse(c.course.placeAndTime).time?.replace(
                                  /\//g,
                                  ' '
                                ) || '시간 미정'
                              : '시간 미정'}
                          </span>
                        </div>
                      </div>

                      <div className="courseActionArea">
                        <div className="cartInfoBox">
                          <svg
                            className="cartIconSvg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                          </svg>
                          <span className={'cartCountNum red'}>
                            {c.cartCount}
                          </span>
                        </div>
                        <div className="arrowBox">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 10 18"
                            fill="none"
                          >
                            <path
                              d="M1 1L9 9L1 17"
                              stroke="#000000"
                              strokeWidth="1"
                              strokeLinecap="round"
                              strokeLinejoin="round"
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

          <div className="regRightColumn">
            <div className="regFloatingBox">
              <div className="regCaptchaRow">
                <div className="regCaptchaDisplay">
                  {captchaDigits.map((digit, index) => (
                    <span
                      key={index}
                      className="regCaptchaDigit"
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
                <div className="regInputWrapper">
                  <input
                    className="regCaptchaInput"
                    placeholder="입 력"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                  />
                </div>
              </div>

              <button className="regSubmitBtn" onClick={handleRegisterAttempt}>
                수강신청
              </button>
            </div>

            <div className="practiceArea">
              <button
                className={`practiceToggleBtn ${pipWindow ? 'active' : ''}`}
                onClick={handleToggleWithCooldown}
                disabled={isCooldown}
                style={{
                  cursor: isCooldown ? 'not-allowed' : 'pointer',
                  opacity: isCooldown ? 0.6 : 1,
                  transition: 'all 0.2s ease',
                }}
              >
                {isCooldown
                  ? '잠시 대기... (1.5s)'
                  : pipWindow
                    ? '연습 종료 (Stop)'
                    : '연습 모드 (Start)'}
              </button>
              <select
                className="timeSettingDropdown"
                value={startOffset}
                onChange={(e) => setStartOffset(Number(e.target.value))}
              >
                <option value={0} disabled hidden>
                  연습 시작 설정
                </option>
                <option value={60}>60초 전</option>
                <option value={30}>30초 전</option>
                <option value={15}>15초 전</option>
              </select>
              <p className="timeSettingInfo">
                ※ 타이머 기본값: 30초전
                <br />
                (8시 29분 30초)
              </p>
            </div>
          </div>
        </div>
      </div>

      {pipWindow &&
        createPortal(
          <PracticeClock currentTime={currentTime} />,
          pipWindow.document.body
        )}

      {waitingInfo &&
        createPortal(
          <WaitingModal
            initialQueueCount={waitingInfo.count}
            initialWaitSeconds={waitingInfo.seconds}
            onComplete={proceedToApiCall}
          />,
          document.body
        )}

      {showSuccessModal &&
        createPortal(
          <SuccessModal
            onKeep={() => handleSuccessClose(false)}
            onGoToHistory={() => handleSuccessClose(true)}
          />,
          document.body
        )}

      {warningType !== 'none' &&
        createPortal(
          <WarningModal
            warningType={warningType}
            onClose={() => setWarningType('none')}
            courseTitle={selectedCourseInfo?.title ?? null}
            courseNumber={selectedCourseInfo?.courseNumber ?? null}
            lectureNumber={selectedCourseInfo?.lectureNumber ?? null}
          />,
          document.body
        )}
      {showNotSupported &&
        createPortal(
          <Warning
            variant="single"
            icon="warning"
            isOpen={showNotSupported}
            onClose={closeNotSupported}
          >
            <p className="warningText">지원하지 않는 기능입니다.</p>
          </Warning>,
          document.body
        )}
    </div>
  );
}
