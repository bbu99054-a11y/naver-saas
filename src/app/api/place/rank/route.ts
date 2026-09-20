import { NextResponse } from 'next/server';
import { diagnosePlaceWithJev } from '@/lib/ai/jevClient';

interface PlaceItem {
  rank: number;
  id: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  hasBooking: boolean;
  placeUrl: string;
}

interface CacheEntry {
  timestamp: number;
  data: {
    totalCount: number;
    items: PlaceItem[];
  };
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

async function fetchLiveNaverPlaceRanking(query: string): Promise<{ totalCount: number; items: PlaceItem[] }> {
  const cleanQuery = query.trim();
  if (!cleanQuery) throw new Error('검색할 키워드를 입력해주세요.');

  const q = encodeURIComponent(cleanQuery);
  const mUrl = `https://m.search.naver.com/search.naver?query=${q}`;
  const res = await fetch(mUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'ko-KR,ko;q=0.9',
    },
    // Next.js fetch cache configuration
    next: { revalidate: 300 }
  });

  if (!res.ok) {
    throw new Error(`네이버 검색 서버 응답 실패 (${res.status})`);
  }

  const html = await res.text();
  const regex = /<a[^>]+href="https:\/\/m\.place\.naver\.com\/(?:place|restaurant|hospital|hairshop|accommodation|nailshop|beauty)\/(\d+)[^"]*"[^>]*>([\s\S]*?)<\/a>/gi;

  const mapById = new Map<string, { id: string; rawItems: string[] }>();
  let m: RegExpExecArray | null;

  while ((m = regex.exec(html)) !== null) {
    const id = m[1];
    const raw = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!raw || raw.length < 2) continue;

    if (!mapById.has(id)) {
      mapById.set(id, { id, rawItems: [] });
    }
    mapById.get(id)!.rawItems.push(raw);
  }

  const items: PlaceItem[] = [];
  const seenNames = new Set<string>();

  for (const [id, data] of mapById.entries()) {
    const rawTexts = data.rawItems;

    // Filter out meta badges and action buttons
    const candidate = rawTexts.find(t => {
      if (/^(이미지\s*수|진료|영업|리뷰|길찾기|전화|거리뷰|공유|블로그|플레이스|내비|지도)/.test(t)) return false;
      if (/^\d+(\.\d+)?(만|개|m|km|명|점)?$/.test(t)) return false;
      return true;
    });

    if (!candidate) continue;

    const hasBooking = rawTexts.some(t => t.includes('예약'));

    // Clean name
    let cleanName = candidate.replace(/^(광고|네이버페이|톡톡|안내|예약|길찾기)\s*/g, '').trim();
    cleanName = cleanName.replace(/(네이버페이|예약|톡톡|쿠폰|주문|새로오픈|광고|TV|플레이스\s*플러스)/g, '').trim();

    // Category detection
    let category = '스마트플레이스 등록점';
    const catMatch = candidate.match(/(카페,디저트|베이커리|피부과|성형외과|한의원|치과|세무사|변호사|법률사무소|음식점|식당|네일|미용실|학원)/);
    if (catMatch) category = catMatch[0];

    const key = cleanName.toLowerCase().replace(/\s+/g, '');
    if (!seenNames.has(key) && cleanName.length >= 2) {
      seenNames.add(key);
      items.push({
        rank: items.length + 1,
        id,
        name: cleanName,
        category,
        address: '지역 중심 상권 소재',
        phone: '',
        hasBooking,
        placeUrl: `https://m.place.naver.com/place/${id}`,
      });
    }
  }

  return {
    totalCount: items.length,
    items,
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';
    const target = searchParams.get('target') || '';

    const cleanQuery = query.trim();
    const cleanTarget = target.trim();

    if (!cleanQuery) {
      return NextResponse.json({
        success: false,
        error: '검색할 플레이스 키워드를 입력해주세요. 예: 강남역 변호사, 서초동 세무사',
      }, { status: 400 });
    }

    const cacheKey = cleanQuery.toLowerCase();
    const cached = cache.get(cacheKey);
    const now = Date.now();

    let rankingData: { totalCount: number; items: PlaceItem[] };

    if (cached && (now - cached.timestamp < CACHE_TTL_MS)) {
      rankingData = cached.data;
    } else {
      rankingData = await fetchLiveNaverPlaceRanking(cleanQuery);
      cache.set(cacheKey, { timestamp: now, data: rankingData });
    }

    // Match target store/business if specified
    let myPlace: (PlaceItem & { isTop5: boolean; isTop10: boolean; percentile: number }) | null = null;
    if (cleanTarget) {
      const targetNorm = cleanTarget.toLowerCase().replace(/\s+/g, '');
      const found = rankingData.items.find(item => {
        const nameNorm = item.name.toLowerCase().replace(/\s+/g, '');
        return nameNorm.includes(targetNorm) || targetNorm.includes(nameNorm);
      });

      if (found) {
        myPlace = {
          ...found,
          isTop5: found.rank <= 5,
          isTop10: found.rank <= 10,
          percentile: Math.max(1, Math.round((found.rank / Math.max(rankingData.totalCount, rankingData.items.length)) * 100)),
        };
      }
    }

    // 🧠 Jev AI 0.05초 순위 정체 원인 & 1위 탈환 처방전 산출
    let jevDiagnosis = null;
    if (cleanTarget) {
      const top1Item = rankingData.items.length > 0 ? rankingData.items[0] : null;
      jevDiagnosis = await diagnosePlaceWithJev({
        query: cleanQuery,
        targetName: cleanTarget,
        rank: myPlace ? myPlace.rank : null,
        hasBooking: myPlace ? myPlace.hasBooking : false,
        top1Name: top1Item ? top1Item.name : '',
      });
    }

    return NextResponse.json({
      success: true,
      query: cleanQuery,
      target: cleanTarget,
      totalCount: rankingData.totalCount,
      searchDate: new Date().toISOString(),
      myPlace,
      jevDiagnosis,
      rankingList: rankingData.items,
    });
  } catch (error: any) {
    console.error('[Place Rank API Error]:', error);
    return NextResponse.json({
      success: false,
      error: error?.message || '네이버 플레이스 순위 조회 중 오류가 발생했습니다.',
    }, { status: 500 });
  }
}
