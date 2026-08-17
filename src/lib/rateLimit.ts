// In-memory Concurrent Lock and Rate Limiting for API safety

interface LockEntry {
  lockedAt: number;
  expiresAt: number;
}

const activeLocks = new Map<string, LockEntry>();
const lastRequestTimestamps = new Map<string, number>();

// 동시 생성 락 획득 (최대 60초 후 자동 만료)
export function acquireConcurrentLock(userId: string, ttlMs: number = 60000): { success: boolean; message?: string } {
  const now = Date.now();
  const existingLock = activeLocks.get(userId);

  if (existingLock) {
    if (now < existingLock.expiresAt) {
      return {
        success: false,
        message: '현재 다른 창에서 원고 생성이 진행 중입니다. 생성이 완료된 후 다시 시도해 주세요.'
      };
    }
    // 만료된 락은 제거
    activeLocks.delete(userId);
  }

  activeLocks.set(userId, {
    lockedAt: now,
    expiresAt: now + ttlMs
  });

  return { success: true };
}

// 동시 생성 락 해제
export function releaseConcurrentLock(userId: string): void {
  activeLocks.delete(userId);
}

// 분당 호출 속도 검사 (Rate Limit)
export function checkRateLimit(userId: string, minIntervalMs: number = 10000): { allowed: boolean; remainingSec?: number } {
  const now = Date.now();
  const lastTime = lastRequestTimestamps.get(userId);

  if (lastTime && now - lastTime < minIntervalMs) {
    const remainingSec = Math.ceil((minIntervalMs - (now - lastTime)) / 1000);
    return {
      allowed: false,
      remainingSec
    };
  }

  lastRequestTimestamps.set(userId, now);
  return { allowed: true };
}
