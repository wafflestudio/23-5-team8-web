// RegistrationWarning.tsx
import {useEffect, useState, useRef} from 'react';
import '../css/Warning.css';
import {calculateQueueInfo} from '../utils/RegistrationUtils.ts';


export type Warning =
  | "beforeTime"
  | "quotaOver"
  | "notChosen"
  | "captchaError"
  | "practiceNotStarted"
  | "none";

interface WarningModalProps {
  warningType: Warning;
  onClose: () => void;
  courseTitle: string | null;
  courseNumber: string | null;
  lectureNumber: string | null;
}

interface WaitingModalProps {
  initialWaitSeconds: number;
  initialQueueCount: number;
  onComplete: () => void;
}

interface SuccessModalProps {
  onKeep: () => void;
  onGoToHistory: () => void;
}

// ... (WarningModal 컴포넌트는 기존과 동일) ...
export function WarningModal({
  warningType,
  onClose,
  courseTitle,
  courseNumber,
  lectureNumber,
}: WarningModalProps) {
  if (warningType === "none") return null;

  const getMessage = (type: Warning) => {
    switch (type) {
      case 'captchaError':
        return '수강신청하지 못했습니다.수강신청\n확인문자와 입력하신 문자가 일치하지\n않습니다.다시 입력 후 수강신청\n해주십시오.';
      case 'beforeTime':
        return '수강신청 시간이 아닙니다.';
      case 'quotaOver':
        return `${courseTitle}(${courseNumber},${lectureNumber}): 수강정원을 초과하였습니다.`;
      case 'notChosen':
        return '수강신청할 강좌를 선택하십시오.';
      case 'practiceNotStarted':
        return '연습 모드가 시작되지 않았습니다.\nStart 버튼을 눌러주세요.';
      default:
        return "알 수 없는 오류가 발생했습니다.";
    }
  };

  return (
    <div className="background">
      <div className="warningContainer">
        <div className="contentWrapper">
          {/* 아이콘 및 텍스트 기존과 동일 */}
          <svg
            width="38"
            height="38"
            viewBox="0 0 50 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="warningIcon"
          >
            <circle
              cx="25"
              cy="25"
              r="25"
              fill="#FFF3E0"
            />
            <rect
              x="23.5"
              y="12"
              width="2"
              height="18"
              rx="1.5"
              fill="#FF9800"
            />
            <circle
              cx="25"
              cy="36"
              r="2"
              fill="#FF9800"
            />
          </svg>
          <p className="warningText">
            {getMessage(warningType)}
          </p>
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

// [Component 수정] 대기열 모달
export const WaitingModal = ({
  initialWaitSeconds,
  initialQueueCount,
  onComplete,
}: WaitingModalProps) => {
  const [queueInfo, setQueueInfo] = useState({
    seconds: initialWaitSeconds,
    count: initialQueueCount,
  });

  // 완료 여부를 추적하는 Ref (useEffect 의존성 문제 해결 및 중복 실행 방지)
  const isCompletedRef = useRef(false);

  useEffect(() => {
    // 0.5초(500ms)마다 실행되는 타이머
    const timer = setInterval(() => {
      // 이미 완료 처리 되었다면 정지
      if (isCompletedRef.current) {
        clearInterval(timer);
        return;
      }

      setQueueInfo((prev) => {
        // 다음 상태 계산 (현재 인원 기준)
        const nextInfo = calculateQueueInfo(
          0,
          prev.count,
        );

        // 종료 조건: 인원이 0명이거나 시간이 0초일 때
        if (
          nextInfo &&
          (nextInfo.queueCount <= 0 ||
            nextInfo.waitSeconds <= 0)
        ) {
          clearInterval(timer);
          isCompletedRef.current = true;

          // 상태 업데이트 없이 바로 완료 콜백 실행 (모달 닫힘)
          // setTimeout을 사용하여 렌더 사이클 이후 실행 보장
          setTimeout(() => onComplete(), 0);

          return { count: 0, seconds: 0 };
        }

        if (nextInfo) {
          return {
            count: nextInfo.queueCount,
            seconds: nextInfo.waitSeconds,
          };
        }
        return prev;
      });
    }, 500); // 0.5초마다 갱신

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="background">
      <div className="waiting-modal-box">
        <h3 className="waiting-title">
          서비스 접속대기 중입니다.
        </h3>
        <p className="waiting-time-highlight">
          예상대기시간:{" "}
          <u>{queueInfo.seconds}초</u>
        </p>

        <div className="waiting-progress-container">
          <div className="waiting-progress-bar"></div>
        </div>

        <div className="waiting-info-text">
          고객님 앞에{" "}
          <strong>
            {Math.floor(queueInfo.count)}명
          </strong>
          의 대기자가 있습니다.
          <br />
          현재 접속 사용자가 많아 대기 중이며,
          잠시 후<br />
          기다리시면 서비스로 자동접속 됩니다.
        </div>

        <p className="waiting-warning-text">
          ※ 재접속하시면 대기시간이 더 길어집니다.
        </p>
      </div>
    </div>
  );
};

export const SuccessModal = ({
  onKeep,
  onGoToHistory,
}: SuccessModalProps) => {
  // 기존 코드 유지
  return (
    <div className="background">
      <div className="warningContainer">
        <div className="success-header">
          <h2 className="success-title">
            수강신청되었습니다.
          </h2>
          <p className="success-desc">
            지금 바로 수강신청내역으로
            이동하시겠습니까?
          </p>
        </div>
        <div className="success-btn-row">
          <button
            className="success-btn gray"
            onClick={onKeep}
          >
            수강신청 계속하기
          </button>
          <button
            className="success-btn blue"
            onClick={onGoToHistory}
          >
            수강신청내역으로 이동
          </button>
        </div>
      </div>
    </div>
  );
};
