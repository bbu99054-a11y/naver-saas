// Distributed PostgreSQL + In-memory Fail-Open Rate Limiting for API safety
import crypto from 'crypto';
import prisma from '@/lib/prisma';

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

// 🌐 클라이언트 IP 추출 유틸리티 (Vercel, Cloudflare 등 신뢰 프록시 헤더 우선)
export function getClientIp(req: Request): string {
  const candidates = [
    req.headers.get('x-vercel-forwarded-for')?.split(',')[0],
    req.headers.get('cf-connecting-ip'),
    req.headers.get('x-real-ip'),
    (() => {
      const xff = req.headers.get('x-forwarded-for');
      if (!xff) return undefined;
      const parts = xff.split(',').map((p) => p.trim()).filter(Boolean);
      return parts.length > 0 ? parts[parts.length - 1] : undefined;
    })(),
  ];

  for (const raw of candidates) {
    if (!raw) continue;
    const normalized = raw.trim().replace(/^::ffff:/i, '').slice(0, 64);
    if (normalized) return normalized;
  }
  return '127.0.0.1';
}

// 🔒 크로스 사이트 브라우저 요청(CSRF / 타 도메인 무단 임베드 API 호출) 차단
export function isCrossSiteBrowserRequest(req: Request): boolean {
  const secFetchSite = (req.headers.get('sec-fetch-site') || '').trim().toLowerCase();
  if (secFetchSite === 'cross-site') {
    return true;
  }

  const origin = req.headers.get('origin');
  if (!origin) {
    return false;
  }

  try {
    const hostname = new URL(origin).hostname.toLowerCase();
    const allowedExact = new Set(['postsyncapp.com', 'www.postsyncapp.com', 'localhost', '127.0.0.1']);
    if (allowedExact.has(hostname) || hostname.endsWith('.postsyncapp.com') || hostname.endsWith('.vercel.app')) {
      return false;
    }
    return true;
  } catch {
    return true;
  }
}

// 🔐 상수 시간(Timing-safe) 비밀 토큰 검증
export function verifyTimingSafeSecret(
  expected: string | undefined,
  provided: string | null | undefined
): boolean {
  const exp = (expected || '').trim();
  const prov = (provided || '').trim();
  if (!exp || !prov) return false;

  const expHash = crypto.createHash('sha256').update(exp).digest();
  const provHash = crypto.createHash('sha256').update(prov).digest();
  return crypto.timingSafeEqual(expHash, provHash);
}

// 🛡️ IP 기반 슬라이딩 윈도우 속도 제한 (인메모리 폴백용)
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

// 🛡️ 서버리스 공용 PostgreSQL 분산 Rate Limit (장애 시 인메모리 Fail-Open)
export async function checkPersistentIpRateLimit(
  bucket: string,
  ip: string,
  limit: number = 12,
  windowMs: number = 60000
): Promise<{ allowed: boolean; remainingSec: number; source: 'db' | 'memory' }> {
  const safeLimit = Math.max(1, Math.floor(limit));
  const safeWindowMs = Math.max(1000, Math.floor(windowMs));
  const compositeKey = `${bucket}:${ip}`.slice(0, 120);

  try {
    const rows = await prisma.$queryRaw<Array<{ count: number; reset_at: Date }>>`
      INSERT INTO "api_rate_limits" ("key", "count", "reset_at", "updated_at")
      VALUES (
        ${compositeKey},
        1,
        NOW() + (${safeWindowMs}::double precision * INTERVAL '1 millisecond'),
        NOW()
      )
      ON CONFLICT ("key") DO UPDATE
      SET
        "count" = CASE
          WHEN "api_rate_limits"."reset_at" <= NOW() THEN 1
          ELSE "api_rate_limits"."count" + 1
        END,
        "reset_at" = CASE
          WHEN "api_rate_limits"."reset_at" <= NOW()
            THEN NOW() + (${safeWindowMs}::double precision * INTERVAL '1 millisecond')
          ELSE "api_rate_limits"."reset_at"
        END,
        "updated_at" = NOW()
      RETURNING "count", "reset_at"
    `;

    // 확률적 만료 행 정리 (요청 경로 블로킹 없음)
    if (Math.random() < 0.02) {
      prisma.$executeRaw`
        DELETE FROM "api_rate_limits"
        WHERE "reset_at" < NOW() - INTERVAL '1 hour'
      `.catch(() => {});
    }

    const row = rows[0];
    if (row && Number(row.count) > safeLimit) {
      const resetMs = new Date(row.reset_at).getTime();
      const remainingSec = Math.max(1, Math.ceil((resetMs - Date.now()) / 1000));
      return { allowed: false, remainingSec, source: 'db' };
    }

    return { allowed: true, remainingSec: 0, source: 'db' };
  } catch (err) {
    console.warn('[RateLimit DB fallback to memory]:', err instanceof Error ? err.message : err);
    const memRes = checkIpRateLimit(compositeKey, safeLimit, safeWindowMs);
    return { ...memRes, source: 'memory' };
  }
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

