// Non-linear display time based on observed queue processing rates:
// 6532 users -> 73s (~89.4/s), 5414 -> 39s (~138.8/s),
// 3237 -> 13s (~249/s), 1767 -> 6s (~294.5/s)
const calculateDisplayTime = (count: number): number => {
  if (count <= 0) return 0;

  let divisor = 100;

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

export const calculateQueueInfo = (
  delayTimeMs: number,
  currentQueueCount?: number
): { queueCount: number; waitSeconds: number } => {
  const MAX_POSSIBLE_USERS = 12500;
  const PEAK_REACTION_MS = 250;
  // SKEW_SHAPE=4 creates S-curve; higher values (e.g., 500) are too steep
  const SKEW_SHAPE = 4;
  const MEAN_CAPACITY = 1600;
  const STD_DEV = 200;
  // ~2.4 users/ms matches observed server processing rate
  const SERVER_SPEED_PER_MS = MEAN_CAPACITY / 500;

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

  const ratio = delayTimeMs / PEAK_REACTION_MS;
  const probability =
    Math.pow(ratio, SKEW_SHAPE) / (1 + Math.pow(ratio, SKEW_SHAPE));
  const totalArrivals = Math.floor(MAX_POSSIBLE_USERS * probability);
  const processedCount = Math.floor(delayTimeMs * SERVER_SPEED_PER_MS);

  let queueCount = totalArrivals - processedCount;
  const noise = Math.floor(Math.random() * 300) - 150;
  queueCount += noise;
  // Clamp to valid range (server may process faster than arrivals)
  queueCount = Math.max(0, Math.min(queueCount, MAX_POSSIBLE_USERS));

  return {
    queueCount,
    waitSeconds: calculateDisplayTime(queueCount),
  };
};
