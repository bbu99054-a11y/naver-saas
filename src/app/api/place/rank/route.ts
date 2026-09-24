import { NextResponse } from 'next/server';
import { diagnosePlaceWithJev } from '@/lib/ai/jevClient';
import { getMonthlyKeywordVolume, KeywordVolumeResult } from '@/lib/naver/searchAdClient';

export interface PlaceItem {
  rank: number;
  id: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  hasBooking: boolean;
  hasCoupon?: boolean;
  visitorReviews?: string;
  blogReviews?: string;
  saveCount?: string;
  placeUrl: string;
}

export interface MetricGap {
  top1: string | boolean;
  my: string | boolean;
  diff?: number;
  status: 'OPTIMAL' | 'DEFICIT' | 'MISSING' | 'ACTIVE' | 'NONE';
}

export interface PlaceGapAnalysis {
  top1Name: string;
  isRank1: boolean;
  metrics: {
    saves: MetricGap;
    visitorReviews: MetricGap;
    blogReviews: MetricGap;
    booking: MetricGap;
    coupon: MetricGap;
  };
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

async function fetchPlaceReviewMeta(placeId: string): Promise<{ visitorReviews: string; blogReviews: string }> {
  try {
    const url = `https://m.place.naver.com/place/${placeId}/home`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9',
      },
      signal: AbortSignal.timeout(3500),
      next: { revalidate: 300 }
    });

    if (res.ok) {
      const html = await res.text();
      const descMatch = html.match(/property="og:description"\s*content="([^"]*)"/i) || html.match(/content="([^"]*)"\s*property="og:description"/i);
      const desc = descMatch ? descMatch[1] : '';
      const vMatch = desc.match(/방문자리뷰\s*([0-9,]+)/);
      const bMatch = desc.match(/블로그리뷰\s*([0-9,]+)/);
      return {
        visitorReviews: vMatch ? vMatch[1] : '-',
        blogReviews: bMatch ? bMatch[1] : '-',
      };
    }
  } catch (err) {
    // Non-blocking timeout or error
  }
  return { visitorReviews: '-', blogReviews: '-' };
}

export async function fetchLiveNaverPlaceRanking(query: string): Promise<{ totalCount: number; items: PlaceItem[] }> {
  // 끝에 붙은 마침표(.), 쉼표(,), 느낌표 등 특수문자 자동 정제
  const cleanQuery = query.replace(/[.,!?~#*]+$/, '').trim();
  if (!cleanQuery) throw new Error('검색할 키워드를 입력해주세요.');

  const q = encodeURIComponent(cleanQuery);

  // 1. 네이버 지도 PCMAP 전용 채널로 실시간 1~20위 정밀 수집 시도 (1차 시도)
  try {
    const pcmapUrl = `https://pcmap.place.naver.com/place/list?query=${q}&x=127.109831&y=37.496457`;
    const res = await fetch(pcmapUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://map.naver.com/',
        'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-site',
        'Upgrade-Insecure-Requests': '1',
      },
      signal: AbortSignal.timeout(7000),
      next: { revalidate: 300 }
    });

    if (res.ok) {
      const html = await res.text();
      const apolloMatch = html.match(/__APOLLO_STATE__\s*=\s*(\{[\s\S]*?\});\s*(?:<\/script>|\n)/);
      if (apolloMatch) {
        const apolloState = JSON.parse(apolloMatch[1]);
        const items: PlaceItem[] = [];
        const seenIds = new Set<string>();

        for (const [k, val] of Object.entries(apolloState)) {
          const v = val as any;
          if (v && (v.name || v.normalizedName) && (v.category || v.roadAddress || v.address)) {
            const id = String(v.id || k.replace(/^[A-Za-z]+:/, ''));
            if (seenIds.has(id)) continue;
            seenIds.add(id);

            const name = String(v.name || v.normalizedName || '').trim();
            if (!name || name.length < 2) continue;

            items.push({
              rank: items.length + 1,
              id,
              name,
              category: v.category || '스마트플레이스 등록점',
              address: v.roadAddress || v.address || v.commonAddress || '지역 중심 상권 소재',
              phone: v.phone || v.virtualPhone || '',
              hasBooking: Boolean(v.hasBooking || v.bookingUrl),
              hasCoupon: Boolean(v.coupon && v.coupon.total > 0),
              visitorReviews: v.visitorReviewCount ? String(v.visitorReviewCount).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '-',
              blogReviews: v.blogCafeReviewCount ? String(v.blogCafeReviewCount).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '-',
              saveCount: v.saveCount ? String(v.saveCount).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '-',
              placeUrl: `https://m.place.naver.com/place/${id}`,
            });

            if (items.length >= 20) break;
          }
        }

        if (items.length > 0) {
          // WAF 403 차단 방지: 리뷰 데이터가 누락된 최상위 매장(최대 3개)만 선별 보강
          const missingRevItems = items.filter(it => it.visitorReviews === '-' || it.blogReviews === '-').slice(0, 3);
          if (missingRevItems.length > 0) {
            await Promise.allSettled(
              missingRevItems.map(async (item) => {
                const rev = await fetchPlaceReviewMeta(item.id);
                if (rev.visitorReviews !== '-') item.visitorReviews = rev.visitorReviews;
                if (rev.blogReviews !== '-') item.blogReviews = rev.blogReviews;
              })
            );
          }

          return {
            totalCount: Math.max(items.length, 20),
            items,
          };
        }
      }
    }
  } catch (err) {
    console.warn('[Pcmap 1차 수집 지연, 모바일 폴백 가동]:', err);
  }

  // 2. Fallback: 네이버 모바일 통합검색 파서 (2차 시도)
  try {
    const mUrl = `https://m.search.naver.com/search.naver?query=${q}`;
    const res = await fetch(mUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://m.naver.com/',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-site',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
      },
      signal: AbortSignal.timeout(6000),
      next: { revalidate: 300 }
    });

    if (res.ok) {
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

        const candidate = rawTexts.find(t => {
          if (/^(이미지\s*수|진료|영업|리뷰|길찾기|전화|거리뷰|공유|블로그|플레이스|내비|지도)/.test(t)) return false;
          if (/^\d+(\.\d+)?(만|개|m|km|명|점)?$/.test(t)) return false;
          return true;
        });

        if (!candidate) continue;

        const hasBooking = rawTexts.some(t => t.includes('예약'));

        let cleanName = candidate.replace(/^(광고|네이버페이|톡톡|안내|예약|길찾기)\s*/g, '').trim();
        cleanName = cleanName.replace(/(네이버페이|예약|톡톡|쿠폰|주문|새로오픈|광고|TV|플레이스\s*플러스)/g, '').trim();

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
            hasCoupon: false,
            visitorReviews: '-',
            blogReviews: '-',
            saveCount: '-',
            placeUrl: `https://m.place.naver.com/place/${id}`,
          });
        }
      }

      if (items.length > 0) {
        // 상위 3개 매장만 실측 리뷰 보강 (WAF 안전선 준수)
        const top3 = items.slice(0, 3);
        await Promise.allSettled(
          top3.map(async (item) => {
            const rev = await fetchPlaceReviewMeta(item.id);
            if (rev.visitorReviews !== '-') item.visitorReviews = rev.visitorReviews;
            if (rev.blogReviews !== '-') item.blogReviews = rev.blogReviews;
          })
        );

        return {
          totalCount: items.length,
          items,
        };
      }
    }
  } catch (err) {
    console.warn('[모바일 2차 수집 지연, PC 웹 검색 3차 안전망 가동]:', err);
  }

  // 3. Fallback: 네이버 PC 웹 통합검색 스마트플레이스 파서 (3차 안전망)
  try {
    const pcUrl = `https://search.naver.com/search.naver?where=nexearch&query=${q}`;
    const res = await fetch(pcUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8',
        'Referer': 'https://www.naver.com/',
      },
      signal: AbortSignal.timeout(6000),
      next: { revalidate: 300 }
    });

    if (res.ok) {
      const html = await res.text();
      const regex = /href="https:\/\/m\.place\.naver\.com\/(?:place|restaurant|hospital|hairshop|accommodation|nailshop|beauty)\/(\d+)[^"]*"[^>]*>([\s\S]*?)<\/a>/gi;
      const items: PlaceItem[] = [];
      const seen = new Set<string>();
      let m: RegExpExecArray | null;

      while ((m = regex.exec(html)) !== null) {
        const id = m[1];
        const raw = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        if (!raw || raw.length < 2 || seen.has(id)) continue;
        if (/^(이미지|진료|영업|리뷰|길찾기|전화|거리뷰|공유|블로그|플레이스|내비|지도)/.test(raw)) continue;

        seen.add(id);
        let cleanName = raw.replace(/^(광고|네이버페이|톡톡|안내|예약|길찾기)\s*/g, '').trim();
        cleanName = cleanName.replace(/(네이버페이|예약|톡톡|쿠폰|주문|새로오픈|광고|TV|플레이스\s*플러스)/g, '').trim();

        items.push({
          rank: items.length + 1,
          id,
          name: cleanName,
          category: '스마트플레이스 등록점',
          address: '지역 중심 상권 소재',
          phone: '',
          hasBooking: false,
          hasCoupon: false,
          visitorReviews: '-',
          blogReviews: '-',
          saveCount: '-',
          placeUrl: `https://m.place.naver.com/place/${id}`,
        });

        if (items.length >= 20) break;
      }

      if (items.length > 0) {
        return {
          totalCount: items.length,
          items,
        };
      }
    }
  } catch (err) {
    console.warn('[PC 웹 3차 수집 오류]:', err);
  }

  throw new Error('네이버 플레이스 실시간 순위 조회 응답이 지연되었습니다. 잠시 후 다시 시도해 주세요.');
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';
    const target = searchParams.get('target') || '';

    const cleanQuery = query.replace(/[.,!?~#*]+$/, '').trim();
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

    // 1. 네이버 플레이스 실시간 순위 및 네이버 검색광고 공식 월간 검색량 병렬 조회
    const [rankingData, searchVolume] = await Promise.all([
      (async () => {
        if (cached && (now - cached.timestamp < CACHE_TTL_MS)) {
          return cached.data;
        }
        const fresh = await fetchLiveNaverPlaceRanking(cleanQuery);
        cache.set(cacheKey, { timestamp: now, data: fresh });
        return fresh;
      })(),
      getMonthlyKeywordVolume(cleanQuery).catch(err => {
        console.warn('[SearchAd Volume Non-blocking Error]:', err);
        return null;
      }),
    ]);

    // 2. 타깃 매장 매칭 (Match target store/business if specified)
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

    // 3. 1위 매장 vs 내 매장 5대 핵심 지표 정량 격차 분석 (Gap Analysis)
    let gapAnalysis: PlaceGapAnalysis | null = null;
    if (myPlace && rankingData.items.length > 0) {
      const top1 = rankingData.items[0];

      const parseNum = (str?: string): number => {
        if (!str || str === '-') return 0;
        const num = str.replace(/[^0-9]/g, '');
        return num ? parseInt(num, 10) : 0;
      };

      const top1Saves = parseNum(top1.saveCount);
      const mySaves = parseNum(myPlace.saveCount);
      const savesGap = top1Saves - mySaves;

      const top1Visitor = parseNum(top1.visitorReviews);
      const myVisitor = parseNum(myPlace.visitorReviews);
      const visitorGap = top1Visitor - myVisitor;

      const top1Blog = parseNum(top1.blogReviews);
      const myBlog = parseNum(myPlace.blogReviews);
      const blogGap = top1Blog - myBlog;

      gapAnalysis = {
        top1Name: top1.name,
        isRank1: myPlace.rank === 1,
        metrics: {
          saves: {
            top1: top1.saveCount || '-',
            my: myPlace.saveCount || '-',
            diff: savesGap > 0 ? savesGap : 0,
            status: savesGap > 0 ? 'DEFICIT' : 'OPTIMAL',
          },
          visitorReviews: {
            top1: top1.visitorReviews || '-',
            my: myPlace.visitorReviews || '-',
            diff: visitorGap > 0 ? visitorGap : 0,
            status: visitorGap > 0 ? 'DEFICIT' : 'OPTIMAL',
          },
          blogReviews: {
            top1: top1.blogReviews || '-',
            my: myPlace.blogReviews || '-',
            diff: blogGap > 0 ? blogGap : 0,
            status: blogGap > 0 ? 'DEFICIT' : 'OPTIMAL',
          },
          booking: {
            top1: top1.hasBooking,
            my: myPlace.hasBooking,
            status: !myPlace.hasBooking && top1.hasBooking ? 'MISSING' : (myPlace.hasBooking ? 'ACTIVE' : 'NONE'),
          },
          coupon: {
            top1: !!top1.hasCoupon,
            my: !!myPlace.hasCoupon,
            status: !myPlace.hasCoupon && top1.hasCoupon ? 'MISSING' : (myPlace.hasCoupon ? 'ACTIVE' : 'NONE'),
          }
        }
      };
    }

    // 4. 🧠 플레이스싱크(PlaceSync) AI 0.05초 순위 정체 원인 & 1위 동기화 전략 산출
    let jevDiagnosis = null;
    if (cleanTarget) {
      const top1Item = rankingData.items.length > 0 ? rankingData.items[0] : null;
      jevDiagnosis = await diagnosePlaceWithJev({
        query: cleanQuery,
        targetName: cleanTarget,
        rank: myPlace ? myPlace.rank : null,
        hasBooking: myPlace ? myPlace.hasBooking : false,
        top1Name: top1Item ? top1Item.name : '',
        category: myPlace ? myPlace.category : '',
        gapAnalysis,
      });
    }

    return NextResponse.json({
      success: true,
      query: cleanQuery,
      target: cleanTarget,
      totalCount: rankingData.totalCount,
      searchDate: new Date().toISOString(),
      searchVolume, // 📊 네이버 공식 월간 검색량 (PC/모바일/합계/경쟁도)
      myPlace,
      gapAnalysis, // 🩺 1위 대비 5대 정량 격차 분석
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
