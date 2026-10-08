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

// 🌐 클라이언트 IP 추출 유틸리티 (Vercel, Cloudflare, 프록시 지원)
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }
  return '127.0.0.1';
}

// 🛡️ IP 기반 슬라이딩 윈도우 속도 제한 (Rate Limiting)
interface IpRateLimitEntry {
  timestamps: number[];
}
const ipRateLimitMap = new Map<string, IpRateLimitEntry>();

export function checkIpRateLimit(
  ip: string,
  limit: number = 12,
  windowMs: number = 60000
): { allowed: boolean; remainingSec: number } {
  const now = Date.now();
  let entry = ipRateLimitMap.get(ip);
  if (!entry) {
    entry = { timestamps: [] };
    ipRateLimitMap.set(ip, entry);
  }

  // 윈도우 밖 만료된 타임스탬프 정리
  entry.timestamps = entry.timestamps.filter(t => now - t < windowMs);

  if (entry.timestamps.length >= limit) {
    const oldest = entry.timestamps[0];
    const remainingSec = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return { allowed: false, remainingSec };
  }

  entry.timestamps.push(now);

  // 메모리 누수 방지 (주기적 정리)
  if (ipRateLimitMap.size > 10000) {
    for (const [key, val] of ipRateLimitMap.entries()) {
      if (val.timestamps.length === 0 || now - val.timestamps[val.timestamps.length - 1] > windowMs) {
        ipRateLimitMap.delete(key);
      }
    }
  }

  return { allowed: true, remainingSec: 0 };
}

// 📧 이메일 발송 쿨다운 (동일 이메일 메일 폭탄 및 Resend 한도 소진 방어)
const emailCoolDownMap = new Map<string, number>();

export function checkEmailCoolDown(
  email: string,
  coolDownMs: number = 180000 // 기본 3분
): { allowed: boolean; remainingSec: number } {
  const now = Date.now();
  const normalizedEmail = email.trim().toLowerCase();
  const lastSent = emailCoolDownMap.get(normalizedEmail);

  if (lastSent && now - lastSent < coolDownMs) {
    const remainingSec = Math.max(1, Math.ceil((coolDownMs - (now - lastSent)) / 1000));
    return { allowed: false, remainingSec };
  }

  emailCoolDownMap.set(normalizedEmail, now);

  if (emailCoolDownMap.size > 5000) {
    for (const [key, val] of emailCoolDownMap.entries()) {
      if (now - val > coolDownMs * 2) {
        emailCoolDownMap.delete(key);
      }
    }
  }

  return { allowed: true, remainingSec: 0 };
}

// 🔒 악성 HTML 인젝션 / XSS 방어용 텍스트 이스케이프
export function escapeHtml(str: string | null | undefined): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

