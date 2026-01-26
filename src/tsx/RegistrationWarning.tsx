import { useEffect, useState, useRef } from 'react';
import '../css/Warning.css';
import { calculateQueueInfo } from '../utils/RegistrationUtils.ts';
import Warning from '../utils/Warning';

export type WarningType =
  | 'beforeTime'
  | 'quotaOver'
  | 'notChosen'
  | 'captchaError'
  | 'practiceNotStarted'
  | 'alreadyAttempted'
  | 'none';

interface WarningModalProps {
  warningType: WarningType;
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

const getWarningMessage = (
  type: WarningType,
  courseTitle: string | null,
  courseNumber: string | null,
  lectureNumber: string | null
) => {
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
    case 'alreadyAttempted':
      return '이미 수강신청한 강의입니다.';
    default:
      return '알 수 없는 오류가 발생했습니다.';
  }
};

export function WarningModal({
  warningType,
  onClose,
  courseTitle,
  courseNumber,
  lectureNumber,
}: WarningModalProps) {
  return (
    <Warning
      variant="single"
      icon="warning"
      isOpen={warningType !== 'none'}
      onClose={onClose}
    >
      <p className="warningText">
        {getWarningMessage(
          warningType,
          courseTitle,
          courseNumber,
          lectureNumber
        )}
      </p>
    </Warning>
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
        const nextInfo = calculateQueueInfo(0, prev.count);

        if (
          nextInfo &&
          (nextInfo.queueCount <= 0 || nextInfo.waitSeconds <= 0)
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
    <Warning
      variant="none"
      isOpen={true}
      containerClassName="waiting-modal-box"
    >
      <h3 className="waiting-title">서비스 접속대기 중입니다.</h3>
      <p className="waiting-time-highlight">
        예상대기시간: <u>{queueInfo.seconds}초</u>
      </p>

      <div className="waiting-progress-container">
        <div className="waiting-progress-bar"></div>
      </div>

      <div className="waiting-info-text">
        고객님 앞에 <strong>{Math.floor(queueInfo.count)}명</strong>
        의 대기자가 있습니다.
        <br />
        현재 접속 사용자가 많아 대기 중이며, 잠시 후<br />
        기다리시면 서비스로 자동접속 됩니다.
      </div>

      <p className="waiting-warning-text">
        ※ 재접속하시면 대기시간이 더 길어집니다.
      </p>
    </Warning>
  );
};

export const SuccessModal = ({ onKeep, onGoToHistory }: SuccessModalProps) => {
  return (
    <Warning
      variant="double"
      isOpen={true}
      onClose={onKeep}
      onConfirm={onGoToHistory}
      title="수강신청되었습니다."
      subtitle="지금 바로 수강신청내역으로 이동하시겠습니까?"
      cancelLabel="수강신청 계속하기"
      confirmLabel="수강신청내역으로 이동"
    />
  );
};
