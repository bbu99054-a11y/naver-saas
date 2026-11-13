import type { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

const DEFAULT_CACHE_TTL_MS = 10 * 60 * 1000; // 10분 공용 캐시
const MAX_LOCAL_CACHE_ENTRIES = 500;

interface LocalCacheEntry<T> {
  expiresAt: number;
  data: T;
}

const localMemoryCache = new Map<string, LocalCacheEntry<unknown>>();
const inflightRequests = new Map<string, Promise<unknown>>();

function setLocalCache<T>(cacheKey: string, data: T, ttlMs: number): void {
  if (localMemoryCache.size >= MAX_LOCAL_CACHE_ENTRIES) {
    const oldestKey = localMemoryCache.keys().next().value;
    if (oldestKey) localMemoryCache.delete(oldestKey);
  }
  localMemoryCache.set(cacheKey, {
    expiresAt: Date.now() + ttlMs,
    data,
  });
}

/**
 * L1(인메모리) + L2(PostgreSQL place_rank_caches) 공유 캐시 레이어.
 * DB 장애나 미생성 시에도 인메모리 캐시와 실시간 수집으로 안전하게 폴백합니다.
 */
export async function getCachedOrFetchPlaceData<T>(
  cacheKey: string,
  fetcher: () => Promise<T>,
  ttlMs: number = DEFAULT_CACHE_TTL_MS
): Promise<T> {
  const safeKey = cacheKey.slice(0, 180);
  const now = Date.now();

  // 1. L1 인메모리 캐시 적중 확인
  const memHit = localMemoryCache.get(safeKey);
  if (memHit && memHit.expiresAt > now) {
    return memHit.data as T;
  }

  // 2. L2 PostgreSQL 공유 캐시 적중 확인 (Fail-Open)
  try {
    const dbHit = await prisma.placeRankCache.findUnique({
      where: { cacheKey: safeKey },
    });
    if (dbHit && dbHit.expiresAt.getTime() > now && dbHit.payload) {
      const payload = dbHit.payload as unknown as T;
      setLocalCache(safeKey, payload, dbHit.expiresAt.getTime() - now);
      return payload;
    }
  } catch (err) {
    console.warn('[PlaceRankCache DB Read Fallback]:', err instanceof Error ? err.message : err);
  }

  // 3. 동일 키워드 동시 요청 병합 (Thundering Herd 방지)
  const existingFlight = inflightRequests.get(safeKey);
  if (existingFlight) {
    return (await existingFlight) as T;
  }

  const fetchPromise = (async () => {
    const freshData = await fetcher();
    const expiresAtDate = new Date(Date.now() + ttlMs);

    setLocalCache(safeKey, freshData, ttlMs);

    try {
      const jsonPayload = JSON.parse(JSON.stringify(freshData)) as Prisma.InputJsonValue;
      await prisma.placeRankCache.upsert({
        where: { cacheKey: safeKey },
        create: {
          cacheKey: safeKey,
          payload: jsonPayload,
          expiresAt: expiresAtDate,
        },
        update: {
          payload: jsonPayload,
          expiresAt: expiresAtDate,
        },
      });

      if (Math.random() < 0.02) {
        prisma.placeRankCache
          .deleteMany({
            where: {
              expiresAt: { lt: new Date(Date.now() - 30 * 60 * 1000) },
            },
          })
          .catch(() => {});
      }
    } catch (writeErr) {
      console.warn('[PlaceRankCache DB Write Fallback]:', writeErr instanceof Error ? writeErr.message : writeErr);
    }

    return freshData;
  })();

  inflightRequests.set(safeKey, fetchPromise);
  try {
    return await fetchPromise;
  } finally {
    inflightRequests.delete(safeKey);
  }
}
