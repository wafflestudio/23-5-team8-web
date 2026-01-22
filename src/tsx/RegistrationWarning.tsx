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

export const WaitingModal = ({
  initialWaitSeconds,
  initialQueueCount,
  onComplete,
}: WaitingModalProps) => {
  const [queueInfo, setQueueInfo] = useState({
    seconds: initialWaitSeconds,
    count: initialQueueCount,
  });

  const isCompletedRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isCompletedRef.current) {
        clearInterval(timer);
        return;
      }

      setQueueInfo((prev) => {
        const nextInfo = calculateQueueInfo(
          0,
          prev.count,
        );

        if (
          nextInfo &&
          (nextInfo.queueCount <= 0 ||
            nextInfo.waitSeconds <= 0)
        ) {
          clearInterval(timer);
          isCompletedRef.current = true;
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
    }, 500);

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
