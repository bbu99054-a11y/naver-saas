import crypto from 'crypto';

export interface KeywordVolumeResult {
  keyword: string;
  monthlyPcQcCnt: number;
  monthlyMobileQcCnt: number;
  totalQcCnt: number;
  compIdx: '높음' | '중간' | '낮음' | string;
  rawPc: string | number;
  rawMobile: string | number;
}

// 10분 인메모리 캐시 (동일 키워드 중복 호출 방지)
interface CacheEntry {
  timestamp: number;
  data: KeywordVolumeResult | null;
}
const volumeCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 10 * 60 * 1000;

/**
 * 네이버 검색광고 공식 API(relsearch / keywordstool)를 통해
 * 특정 키워드의 실시간 PC + 모바일 월간 검색량을 조회합니다.
 */
export async function getMonthlyKeywordVolume(keyword: string): Promise<KeywordVolumeResult | null> {
  const cleanKw = (keyword || '').trim().replace(/\s+/g, '');
  if (!cleanKw || cleanKw.length < 2) return null;

  const cacheKey = cleanKw.toLowerCase();
  const cached = volumeCache.get(cacheKey);
  const now = Date.now();
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const apiKey = process.env.NAVER_API_KEY;
  const secretKey = process.env.NAVER_SECRET_KEY;
  const customerId = process.env.NAVER_CUSTOMER_ID;

  if (!apiKey || !secretKey || !customerId) {
    console.warn('[Naver SearchAd]: API credentials not configured in environment.');
    return null;
  }

  try {
    const timestamp = String(Date.now());
    const method = 'GET';
    const reqPath = '/keywordstool';
    const message = `${timestamp}.${method}.${reqPath}`;

    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(message);
    const signature = hmac.digest('base64');

    const url = `https://api.naver.com${reqPath}?hintKeywords=${encodeURIComponent(cleanKw)}&showDetail=1`;

    const res = await fetch(url, {
      headers: {
        'X-Timestamp': timestamp,
        'X-API-KEY': apiKey,
        'X-Customer': String(customerId),
        'X-Signature': signature,
      },
      signal: AbortSignal.timeout(4000), // 4초 타임아웃
      next: { revalidate: 600 } // Next.js 10분 캐시
    });

    if (!res.ok) {
      console.warn(`[Naver SearchAd API]: Response failed with status ${res.status}`);
      volumeCache.set(cacheKey, { timestamp: now, data: null });
      return null;
    }

    const data = await res.json();
    if (!data.keywordList || !Array.isArray(data.keywordList) || data.keywordList.length === 0) {
      volumeCache.set(cacheKey, { timestamp: now, data: null });
      return null;
    }

    // 정확히 일치하는 키워드를 우선 탐색, 없으면 첫 번째 연관 키워드 채택
    const matched = data.keywordList.find((item: any) => item.relKeyword === cleanKw) || data.keywordList[0];

    const parseCount = (val: any): number => {
      if (typeof val === 'number') return val;
      if (typeof val === 'string') {
        const cleaned = val.replace(/[^0-9]/g, '');
        return cleaned ? parseInt(cleaned, 10) : 10; // '< 10' 등은 10으로 취급
      }
      return 0;
    };

    const pcCnt = parseCount(matched.monthlyPcQcCnt);
    const mobileCnt = parseCount(matched.monthlyMobileQcCnt);

    const result: KeywordVolumeResult = {
      keyword: matched.relKeyword || cleanKw,
      monthlyPcQcCnt: pcCnt,
      monthlyMobileQcCnt: mobileCnt,
      totalQcCnt: pcCnt + mobileCnt,
      compIdx: matched.compIdx || '중간',
      rawPc: matched.monthlyPcQcCnt,
      rawMobile: matched.monthlyMobileQcCnt,
    };

    volumeCache.set(cacheKey, { timestamp: now, data: result });
    return result;

  } catch (err) {
    console.warn('[Naver SearchAd Volume Fetch Error]:', err);
    volumeCache.set(cacheKey, { timestamp: now, data: null });
    return null;
  }
}
