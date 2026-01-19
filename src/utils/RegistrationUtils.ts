// [Logic 1] 남은 인원에 따른 '표시용' 대기 시간 계산 (비선형)
const calculateDisplayTime = (count: number): number => {
  if (count <= 0) return 0;

  // 요청하신 데이터 포인트에 맞춘 구간별 나누기 값(divisor) 설정
  // 6532명 -> 73초 (약 89.4명/초)
  // 5414명 -> 39초 (약 138.8명/초)
  // 3237명 -> 13초 (약 249명/초)
  // 1767명 -> 6초 (약 294.5명/초)

  let divisor = 100; // 기본값

  if (count > 6000) {
    divisor = 120;
  } else if (count > 4500) {
    divisor = 140;
  } else if (count > 2500) {
    divisor = 240;
  } else {
    divisor = 300;
  }

  return Math.ceil(count / divisor);
};

// [Logic 2] 대기열 상태 업데이트 로직 (처리된 인원 차감 로직 추가)
export const calculateQueueInfo = (
  delayTimeMs: number,
  currentQueueCount?: number,
) => {
  // === 설정값 ===
  const MAX_POSSIBLE_USERS = 12500;
  const PEAK_REACTION_MS = 250;
  const SKEW_SHAPE = 4; // 500은 너무 수직이라 S자 곡선을 위해 4로 조정
  const MEAN_CAPACITY = 1600;
  const STD_DEV = 200;

  // 서버 처리 속도 (위쪽 로직과 싱크 맞춤: 1200명 / 500ms = 2.4명/ms)
  const SERVER_SPEED_PER_MS = MEAN_CAPACITY / 500;

  // Case 1: 업데이트 모드 (기존 동일)
  if (currentQueueCount !== undefined) {
    let u = 0,
      v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    const dropAmount = Math.floor(MEAN_CAPACITY + z * STD_DEV);
    const finalDrop = Math.max(0, dropAmount);
    const nextQueueCount = Math.max(0, currentQueueCount - finalDrop);

    return {
      queueCount: nextQueueCount,
      waitSeconds: calculateDisplayTime(nextQueueCount),
    };
  }

  // 1. 지금까지 도착한 총 누적 인원 (Arrivals) 계산
  const ratio = delayTimeMs / PEAK_REACTION_MS;
  const probability =
    Math.pow(ratio, SKEW_SHAPE) / (1 + Math.pow(ratio, SKEW_SHAPE));
  const totalArrivals = Math.floor(MAX_POSSIBLE_USERS * probability);

  // 2. [추가] 지연 시간 동안 서버가 이미 처리한 인원 (Processed) 계산
  const processedCount = Math.floor(delayTimeMs * SERVER_SPEED_PER_MS);

  // 3. 실제 내 앞의 대기열 = (총 도착 인원) - (이미 처리된 인원)
  let queueCount = totalArrivals - processedCount;

  // 랜덤 노이즈 추가
  const noise = Math.floor(Math.random() * 300) - 150;
  queueCount += noise;

  // 음수 방지 (처리 속도가 더 빨라서 대기열이 해소된 경우 0명)
  queueCount = Math.max(0, queueCount);

  // Max Cap 적용
  if (queueCount > MAX_POSSIBLE_USERS) queueCount = MAX_POSSIBLE_USERS;

  return {
    queueCount,
    waitSeconds: calculateDisplayTime(queueCount),
  };
};
