import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { diagnosePlaceWithJev } from '@/lib/ai/jevClient';
import { getMonthlyKeywordVolume } from '@/lib/naver/searchAdClient';
import { getClientIp, checkIpRateLimit } from '@/lib/rateLimit';

export const maxDuration = 30;

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

export type MetricStatus = 'OPTIMAL' | 'DEFICIT' | 'MISSING' | 'ACTIVE' | 'NONE' | 'UNMEASURED';

export interface MetricGap {
  top1: string | boolean;
  my: string | boolean;
  diff?: number;
  status: MetricStatus;
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

export interface CommercialCoords {
  x: string;
  y: string;
  name: string;
}

/**
 * 🗺️ 검색어 키워드 기반 스마트 상권 좌표 매핑 함수 (전국 50대 핵심 상권)
 * WGS84 좌표 기준 (x: 경도 Longitude 126~129, y: 위도 Latitude 33~38)
 */
export function extractCommercialCoords(query: string): CommercialCoords | null {
  const q = query.toLowerCase().replace(/\s+/g, '');

  const COMMERCIAL_HUBS: Array<{ keywords: string[]; name: string; x: string; y: string }> = [
    // 서울 주요 상권
    { keywords: ['강남역', '강남'], name: '강남', x: '127.0276', y: '37.4979' },
    { keywords: ['서초역', '서초동', '서초', '교대역', '교대'], name: '서초', x: '127.0078', y: '37.4919' },
    { keywords: ['역삼역', '역삼'], name: '역삼', x: '127.0365', y: '37.5006' },
    { keywords: ['선릉역', '선릉', '삼성역', '삼성동', '코엑스'], name: '삼성', x: '127.0592', y: '37.5088' },
    { keywords: ['신사역', '신사동', '가로수길', '압구정', '압구정로데오'], name: '압구정/신사', x: '127.0205', y: '37.5163' },
    { keywords: ['청담역', '청담동', '청담'], name: '청담', x: '127.0532', y: '37.5195' },
    { keywords: ['홍대입구역', '홍대입구', '홍대', '연남동', '연남', '합정역', '합정', '상수역', '망원동', '망원'], name: '홍대/합정', x: '126.9245', y: '37.5568' },
    { keywords: ['신촌역', '신촌', '이대역', '이대'], name: '신촌', x: '126.9368', y: '37.5552' },
    { keywords: ['잠실역', '잠실', '송파', '방이동', '석촌호수', '문정역', '문정동', '문정'], name: '잠실/송파', x: '127.1002', y: '37.5133' },
    { keywords: ['여의도역', '여의도', '더현대'], name: '여의도', x: '126.9242', y: '37.5216' },
    { keywords: ['성수역', '성수동', '성수', '서울숲'], name: '성수', x: '127.0559', y: '37.5445' },
    { keywords: ['건대입구역', '건대입구', '건대'], name: '건대', x: '127.0709', y: '37.5404' },
    { keywords: ['종각역', '종로', '을지로', '광화문', '시청역', '명동'], name: '종로/을지로', x: '126.9830', y: '37.5702' },
    { keywords: ['이태원역', '이태원', '한남동', '한남'], name: '이태원/한남', x: '126.9944', y: '37.5345' },
    { keywords: ['혜화역', '혜화', '대학로'], name: '대학로', x: '127.0019', y: '37.5824' },
    { keywords: ['마포역', '마포', '공덕역', '공덕'], name: '마포/공덕', x: '126.9517', y: '37.5441' },
    { keywords: ['영등포역', '영등포', '타임스퀘어', '문래동', '문래'], name: '영등포', x: '126.9077', y: '37.5158' },
    { keywords: ['신도림역', '신도림', '구로디지털단지', '구디', '구로'], name: '신도림/구로', x: '126.8911', y: '37.5088' },
    { keywords: ['노원역', '노원', '상계동'], name: '노원', x: '127.0611', y: '37.6542' },
    { keywords: ['목동역', '목동', '오목교역', '오목교'], name: '목동', x: '126.8648', y: '37.5244' },
    { keywords: ['천호역', '천호동', '천호', '길동', '강동'], name: '천호/강동', x: '127.1238', y: '37.5386' },

    // 경기/인천 주요 상권
    { keywords: ['판교역', '판교', '삼평동', '백현동'], name: '판교', x: '127.1112', y: '37.3948' },
    { keywords: ['서현역', '서현', '정자역', '정자동', '야탑역', '야탑', '분당'], name: '분당', x: '127.1214', y: '37.3850' },
    { keywords: ['수원역', '수원', '인계동', '광교', '영통'], name: '수원/인계', x: '127.0286', y: '37.2636' },
    { keywords: ['일산', '라페스타', '웨스턴돔', '정발산역', '주엽역', '킨텍스'], name: '일산', x: '126.7712', y: '37.6584' },
    { keywords: ['범계역', '범계', '평촌역', '평촌', '안양역', '안양'], name: '안양/범계', x: '126.9507', y: '37.3898' },
    { keywords: ['부천역', '부천', '신중동역', '신중동', '상동역', '상동'], name: '부천', x: '126.7660', y: '37.5030' },
    { keywords: ['송도', '송도센트럴파크', '송도동'], name: '인천송도', x: '126.6543', y: '37.3946' },
    { keywords: ['구월동', '인천터미널', '예술회관역'], name: '인천구월', x: '126.7027', y: '37.4449' },
    { keywords: ['부평역', '부평'], name: '인천부평', x: '126.7238', y: '37.4895' },
    { keywords: ['동탄', '동탄역', '동탄2'], name: '화성동탄', x: '127.0964', y: '37.2001' },
    { keywords: ['수지구청', '수지', '죽전', '용인'], name: '용인수지', x: '127.0978', y: '37.3223' },
    { keywords: ['평택역', '평택', '고덕'], name: '평택', x: '127.0851', y: '36.9906' },
    { keywords: ['의정부역', '의정부'], name: '의정부', x: '127.0459', y: '37.7385' },
    { keywords: ['중앙역', '고잔동', '안산'], name: '안산', x: '126.8385', y: '37.3160' },

    // 부산 상권
    { keywords: ['서면역', '서면', '전포동', '전포카페거리', '전포'], name: '부산서면', x: '129.0596', y: '35.1578' },
    { keywords: ['해운대역', '해운대', '마린시티', '센텀시티', '센텀', '우동', '중동'], name: '부산해운대', x: '129.1631', y: '35.1587' },
    { keywords: ['광안리', '광안역', '수영역', '민락동'], name: '부산광안리', x: '129.1186', y: '35.1532' },
    { keywords: ['남포동', '자갈치', '광복동', '부산역'], name: '부산남포', x: '129.0306', y: '35.0979' },
    { keywords: ['동래역', '동래', '온천장', '부산대'], name: '부산동래', x: '129.0838', y: '35.2052' },

    // 대구 상권
    { keywords: ['동성로', '반월당역', '반월당', '중앙로역'], name: '대구동성로', x: '128.5969', y: '35.8690' },
    { keywords: ['수성못', '범어역', '범어동', '수성구'], name: '대구수성', x: '128.6253', y: '35.8587' },
    { keywords: ['두류역', '두류동', '광장코아'], name: '대구두류', x: '128.5574', y: '35.8568' },

    // 대전 상권
    { keywords: ['둔산동', '시청역', '정부청사', '갤러리아타임월드'], name: '대전둔산', x: '127.3845', y: '36.3504' },
    { keywords: ['유성온천역', '유성온천', '봉명동', '궁동', '충남대'], name: '대전유성', x: '127.3444', y: '36.3537' },
    { keywords: ['은행동', '중앙로역', '대전역', '으능정이'], name: '대전은행', x: '127.4275', y: '36.3277' },

    // 광주 상권
    { keywords: ['상무지구', '상무역', '치평동'], name: '광주상무', x: '126.8525', y: '35.1517' },
    { keywords: ['충장로', '금남로', '문화전당역', '동명동'], name: '광주충장로', x: '126.9189', y: '35.1478' },
    { keywords: ['수완지구', '첨단지구', '첨단'], name: '광주수완/첨단', x: '126.8378', y: '35.1925' },

    // 울산 상권
    { keywords: ['삼산동', '달동', '울산역', '현대백화점울산'], name: '울산삼산', x: '129.3366', y: '35.5396' },
    { keywords: ['성남동', '성남동젊음의거리'], name: '울산성남', x: '129.3175', y: '35.5539' },

    // 충청/전라/경상/강원/제주 주요 상권
    { keywords: ['천안역', '신부동', '불당동', '신불당', '두정동', '천안'], name: '천안', x: '127.1082', y: '36.8198' },
    { keywords: ['성안길', '복대동', '지웰시티', '청주'], name: '청주', x: '127.4332', y: '36.6425' },
    { keywords: ['전주신시가지', '효자동', '한옥마을', '객사', '전주'], name: '전주', x: '127.1147', y: '35.8152' },
    { keywords: ['상남동', '용호동', '창원'], name: '창원상남', x: '128.6822', y: '35.2215' },
    { keywords: ['포항', '영일대', '이동'], name: '포항', x: '129.3789', y: '36.0569' },
    { keywords: ['단계동', '무실동', '원주'], name: '원주', x: '127.9304', y: '37.3438' },
    { keywords: ['노형동', '연동', '제주공항', '신제주', '제주시', '서귀포', '제주'], name: '제주', x: '126.4862', y: '33.4888' },
  ];

  for (const hub of COMMERCIAL_HUBS) {
    if (hub.keywords.some(k => q.includes(k.toLowerCase()))) {
      return { x: hub.x, y: hub.y, name: hub.name };
    }
  }

  return null;
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

/**
 * 🚀 네이버 플레이스 실시간 1~20위 정밀 수집 엔진
 * 1차 기본: 네이버 모바일 통합검색 (빠른 응답 속도 & 차단 없음)
 * 2차 폴백: 네이버 PC 웹 통합검색
 * 3차 폴백: 네이버 지도 PCMAP (짧은 타임아웃)
 */
export async function fetchLiveNaverPlaceRanking(
  query: string,
  coords?: { x?: string; y?: string }
): Promise<{ totalCount: number; items: PlaceItem[] }> {
  const cleanQuery = query.replace(/[.,!?~#*]+$/, '').trim();
  if (!cleanQuery) throw new Error('검색할 키워드를 입력해주세요.');

  const q = encodeURIComponent(cleanQuery);
  const posX = coords?.x?.trim();
  const posY = coords?.y?.trim();
  const coordParam = posX && posY ? `&x=${posX}&y=${posY}` : '';

  // 1. [1차 기본 엔진] 네이버 모바일 통합검색 Cheerio 정밀 파서 (초고속 실시간 수집, 429 차단 없음)
  try {
    const mUrl = `https://m.search.naver.com/search.naver?query=${q}${coordParam}`;
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
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 300 }
    });

    if (res.ok) {
      const html = await res.text();
      const $ = cheerio.load(html);
      const items: PlaceItem[] = [];
      const seenIds = new Set<string>();
      const seenNames = new Set<string>();

      $('a').each((_, el) => {
        const href = $(el).attr('href') || '';
        // 썸네일, 사진, 리뷰, 외부 링크는 건너뜀
        if (href.includes('/photo') || href.includes('/review') || $(el).hasClass('place_thumb')) {
          return;
        }

        const match = href.match(/^https:\/\/m\.place\.naver\.com\/(?:place|restaurant|hospital|hairshop|accommodation|nailshop|beauty)\/(\d+)/)
          || href.match(/(?:^|\.)naver\.com\/(?:[^\"]*\/)?place\/(\d+)/);
        if (!match) return;
        const id = match[1];
        if (seenIds.has(id)) return;

        let name = '';
        let category = '';
        let address = '';
        let hasBooking = false;
        let hasCoupon = false;

        // 1) 네이버 스마트플레이스 정밀 클래스 선택자 우선 추출
        const specificNameEl = $(el).find('.TYaxT, .LGJdP, .q2LdB, .UPDKY, .place_bluelink, .YwYLL');
        if (specificNameEl.length > 0) {
          name = specificNameEl.first().text().trim();
        } else {
          // 2) 일반 앵커인 경우 blind span, svg 제거 후 텍스트 추출
          const $clone = $(el).clone();
          $clone.find('svg, .place_blind, .W6IZ8, [class*="badge"], [class*="icon"], [class*="thumb"]').remove();
          const candidate = $clone.text().replace(/\s+/g, ' ').trim();
          if (
            candidate &&
            candidate.length >= 2 &&
            !/^\d+$/.test(candidate) &&
            !/^(이미지|진료|영업|리뷰|길찾기|전화|거리뷰|공유|블로그|플레이스|내비|지도|더보기|사진|MY|예약|쿠폰)/.test(candidate) &&
            !candidate.includes('원에 접수') &&
            !candidate.includes('리뷰') &&
            candidate.length < 50
          ) {
            name = candidate;
          }
        }

        if (!name || name.length < 2 || /^\d+$/.test(name)) return;

        // 광고, 톡톡, 예약 등 접두/접미 노이즈 정제
        name = name.replace(/^(광고|네이버페이|톡톡|안내|예약|길찾기)\s*/g, '').trim();
        name = name.replace(/(네이버페이|예약|톡톡|쿠폰|주문|새로오픈|광고|TV|플레이스\s*플러스)/g, '').trim();
        if (name.length < 2 || /^\d+$/.test(name)) return;

        const nameKey = name.toLowerCase().replace(/\s+/g, '');
        if (seenNames.has(nameKey)) return;

        seenIds.add(id);
        seenNames.add(nameKey);

        // 카테고리 추출
        const catEl = $(el).find('.KCMnt, .NOJeK');
        if (catEl.length > 0) {
          category = catEl.first().text().trim();
        }
        // 주소 추출 (목록형 .NOJeK 2번째 요소 등)
        const nojek = $(el).find('.NOJeK');
        if (nojek.length > 1) {
          address = $(nojek[1]).text().trim();
        }

        hasBooking = $(el).text().includes('예약');
        hasCoupon = $(el).find('.PdahN').length > 0 || $(el).text().includes('쿠폰');

        // 상위 컨테이너에서 방문자/블로그 리뷰 수 추출
        let visitorReviews = '-';
        let blogReviews = '-';
        const container = $(el).closest('li, div[class*="item"], div[class*="Card"]');
        const containerText = container.length > 0 ? container.text() : $(el).text();
        const vM = containerText.match(/방문자리뷰\s*([0-9,]+)/) || containerText.match(/리뷰\s*([0-9,]+)/);
        if (vM) visitorReviews = vM[1];
        const bM = containerText.match(/블로그리뷰\s*([0-9,]+)/);
        if (bM) blogReviews = bM[1];

        items.push({
          rank: items.length + 1,
          id,
          name,
          category: category || '스마트플레이스 등록점',
          address: address || '지역 중심 상권 소재',
          phone: '',
          hasBooking,
          hasCoupon,
          visitorReviews,
          blogReviews,
          saveCount: '-',
          placeUrl: `https://m.place.naver.com/place/${id}`,
        });

        if (items.length >= 20) return false;
      });

      if (items.length > 0) {
        // 상위 3개 매장 실측 리뷰 보강 (WAF 안전선 준수)
        const top3Missing = items.slice(0, 3).filter(it => it.visitorReviews === '-' || it.blogReviews === '-');
        if (top3Missing.length > 0) {
          await Promise.allSettled(
            top3Missing.map(async (item) => {
              const rev = await fetchPlaceReviewMeta(item.id);
              if (rev.visitorReviews !== '-') item.visitorReviews = rev.visitorReviews;
              if (rev.blogReviews !== '-') item.blogReviews = rev.blogReviews;
            })
          );
        }

        return {
          totalCount: items.length,
          items,
        };
      }
    }
  } catch (err) {
    console.warn('[1차 모바일 수집 지연, 2차 PC 웹 검색 폴백 가동]:', err);
  }

  // 2. [2차 폴백] 네이버 PC 웹 통합검색 스마트플레이스 파서
  try {
    const pcUrl = `https://search.naver.com/search.naver?where=nexearch&query=${q}`;
    const res = await fetch(pcUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8',
        'Referer': 'https://www.naver.com/',
      },
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 300 }
    });

    if (res.ok) {
      const html = await res.text();
      const $ = cheerio.load(html);
      const items: PlaceItem[] = [];
      const seenIds = new Set<string>();
      const seenNames = new Set<string>();

      $('a[href*="/place/"], a[href*="m.place.naver.com"]').each((_, el) => {
        const href = $(el).attr('href') || '';
        if (href.includes('/photo') || href.includes('/review') || $(el).hasClass('place_thumb')) {
          return;
        }

        const match = href.match(/\/place\/(\d+)/)
          || href.match(/(?:place|restaurant|hospital|hairshop|accommodation|nailshop|beauty)\/(\d+)/);
        if (!match) return;
        const id = match[1];
        if (seenIds.has(id)) return;

        let name = '';
        let category = '';
        let address = '';

        const nameEl = $(el).find('.TYaxT, .LGJdP, .q2LdB, .place_bluelink, .YwYLL');
        if (nameEl.length > 0) {
          name = nameEl.first().text().trim();
        } else {
          const $clone = $(el).clone();
          $clone.find('svg, .place_blind, .W6IZ8, [class*="badge"], [class*="icon"], [class*="thumb"]').remove();
          const candidate = $clone.text().replace(/\s+/g, ' ').trim();
          if (
            candidate &&
            candidate.length >= 2 &&
            !/^\d+$/.test(candidate) &&
            !/^(이미지|진료|영업|리뷰|길찾기|전화|거리뷰|공유|블로그|플레이스|내비|지도|더보기|사진)/.test(candidate) &&
            !candidate.includes('원에 접수') &&
            !candidate.includes('리뷰') &&
            candidate.length < 50
          ) {
            name = candidate;
          }
        }

        if (!name || name.length < 2 || /^\d+$/.test(name)) return;

        name = name.replace(/^(광고|네이버페이|톡톡|안내|예약|길찾기)\s*/g, '').trim();
        name = name.replace(/(네이버페이|예약|톡톡|쿠폰|주문|새로오픈|광고|TV|플레이스\s*플러스)/g, '').trim();
        if (name.length < 2 || /^\d+$/.test(name)) return;

        const nameKey = name.toLowerCase().replace(/\s+/g, '');
        if (seenNames.has(nameKey)) return;

        seenIds.add(id);
        seenNames.add(nameKey);

        const catEl = $(el).find('.KCMnt, .NOJeK');
        if (catEl.length > 0) category = catEl.first().text().trim();
        const nojek = $(el).find('.NOJeK');
        if (nojek.length > 1) address = $(nojek[1]).text().trim();

        items.push({
          rank: items.length + 1,
          id,
          name,
          category: category || '스마트플레이스 등록점',
          address: address || '지역 중심 상권 소재',
          phone: '',
          hasBooking: $(el).text().includes('예약'),
          hasCoupon: $(el).text().includes('쿠폰'),
          visitorReviews: '-',
          blogReviews: '-',
          saveCount: '-',
          placeUrl: `https://m.place.naver.com/place/${id}`,
        });

        if (items.length >= 20) return false;
      });

      if (items.length > 0) {
        // 상위 3개 매장 실측 리뷰 보강
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
    console.warn('[2차 PC 웹 검색 폴백 지연, 3차 PCMAP 안전망 가동]:', err);
  }

  // 3. [3차 폴백] 네이버 지도 PCMAP (짧은 3초 타임아웃)
  try {
    const pcmapUrl = `https://pcmap.place.naver.com/place/list?query=${q}&x=${posX || '127.0276'}&y=${posY || '37.4979'}`;
    const res = await fetch(pcmapUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9',
        'Referer': 'https://map.naver.com/',
      },
      signal: AbortSignal.timeout(3000),
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
          if (k.startsWith('Ad:') || v?.__typename?.includes('Ad') || v?.isAd) continue;
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
          return {
            totalCount: items.length,
            items,
          };
        }
      }
    }
  } catch (err) {
    console.warn('[3차 PCMAP 수집 오류]:', err);
  }

  throw new Error('네이버 플레이스 실시간 순위 조회 응답이 지연되었습니다. 잠시 후 다시 시도해 주세요.');
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';
    const target = searchParams.get('target') || '';
    const rawCoordX = searchParams.get('x') || '';
    const rawCoordY = searchParams.get('y') || '';

    const cleanQuery = query.replace(/[.,!?~#*]+$/, '').trim();
    const cleanTarget = target.trim();

    if (!cleanQuery) {
      return NextResponse.json({
        success: false,
        error: '검색할 플레이스 키워드를 입력해주세요. 예: 강남역 변호사, 서초동 세무사, 성수동 카페',
      }, { status: 400 });
    }

    if (cleanQuery.length > 50) {
      return NextResponse.json({
        success: false,
        error: '검색 키워드는 50자 이내로 입력해 주세요.',
      }, { status: 400 });
    }

    // 🛡️ IP 기반 Rate Limiting (1분당 최대 12회 조회 제한 - 네이버 IP 차단 및 서버 남용 방어)
    const clientIp = getClientIp(req);
    const ipCheck = checkIpRateLimit(clientIp, 12, 60000);
    if (!ipCheck.allowed) {
      return NextResponse.json({
        success: false,
        error: `단시간 내 조회 요청이 너무 많습니다. ${ipCheck.remainingSec}초 후 다시 시도해 주세요.`,
      }, { status: 429 });
    }

    // 좌표값 판별: 사용자 전달 좌표 검증 ➔ 없을 경우 검색어 기반 스마트 상권 좌표 자동 추출
    let coordX = /^\d+(\.\d+)?$/.test(rawCoordX) ? rawCoordX : '';
    let coordY = /^\d+(\.\d+)?$/.test(rawCoordY) ? rawCoordY : '';

    if (!coordX || !coordY) {
      const hubCoords = extractCommercialCoords(cleanQuery);
      if (hubCoords) {
        coordX = hubCoords.x;
        coordY = hubCoords.y;
      }
    }

    const cacheKey = `${cleanQuery.toLowerCase()}_${coordX}_${coordY}`;
    const cached = cache.get(cacheKey);
    const now = Date.now();

    // 인메모리 캐시 최대 크기 제한 (500개 초과 시 가장 오래된 항목 퇴출)
    if (cache.size > 500) {
      const oldestKey = cache.keys().next().value;
      if (oldestKey) cache.delete(oldestKey);
    }

    // 1. 네이버 플레이스 실시간 순위 및 네이버 검색광고 공식 월간 검색량 병렬 조회
    const [rankingData, searchVolume] = await Promise.all([
      (async () => {
        if (cached && (now - cached.timestamp < CACHE_TTL_MS)) {
          return cached.data;
        }
        const fresh = await fetchLiveNaverPlaceRanking(cleanQuery, { x: coordX, y: coordY });
        cache.set(cacheKey, { timestamp: now, data: fresh });
        return fresh;
      })(),
      getMonthlyKeywordVolume(cleanQuery).catch(err => {
        console.warn('[SearchAd Volume Non-blocking Error]:', err);
        return null;
      }),
    ]);

    // 2. 1위 매장(Rank 1) 실측 리뷰 보강 (격차 정밀 계산을 위해 1위 리뷰 수 100% 확보)
    if (rankingData.items.length > 0) {
      const top1Item = rankingData.items[0];
      if (top1Item.visitorReviews === '-' || top1Item.blogReviews === '-') {
        try {
          const rev = await fetchPlaceReviewMeta(top1Item.id);
          if (rev.visitorReviews !== '-') top1Item.visitorReviews = rev.visitorReviews;
          if (rev.blogReviews !== '-') top1Item.blogReviews = rev.blogReviews;
        } catch (e) {
          // Non-blocking fallback
        }
      }
    }

    // 3. 타깃 매장 정밀 매칭 (Exact Match 우선 및 일반명사 오매칭 방어)
    let myPlace: (PlaceItem & { isTop5: boolean; isTop10: boolean; percentile: number }) | null = null;
    if (cleanTarget) {
      const targetNorm = cleanTarget.toLowerCase().replace(/\s+/g, '');

      // 1단계: 완전 일치 (Exact Match)
      let found = rankingData.items.find(item => {
        const nameNorm = item.name.toLowerCase().replace(/\s+/g, '');
        return nameNorm === targetNorm;
      });

      // 2단계: 완전 일치가 없고 입력어가 2글자 이상인 경우, 정밀 접두/포함 매칭
      if (!found && targetNorm.length >= 2) {
        const genericWords = ['변호사', '세무사', '회계사', '법무법인', '치과', '병원', '의원', '한의원', '카페', '식당', '맛집', '학원', '부동산', '헤어', '미용실'];
        const isGenericOnly = genericWords.includes(targetNorm);

        if (!isGenericOnly) {
          found = rankingData.items.find(item => {
            const nameNorm = item.name.toLowerCase().replace(/\s+/g, '');
            return nameNorm.startsWith(targetNorm) || nameNorm.includes(targetNorm);
          });
        }
      }

      if (found) {
        // 내 매장의 리뷰 정보가 누락('-')되어 있는 경우, 단건 정밀 보강 (순위 무관 100% 실측)
        if (found.visitorReviews === '-' || found.blogReviews === '-') {
          try {
            const rev = await fetchPlaceReviewMeta(found.id);
            if (rev.visitorReviews !== '-') found.visitorReviews = rev.visitorReviews;
            if (rev.blogReviews !== '-') found.blogReviews = rev.blogReviews;
          } catch (e) {
            // Non-blocking fallback
          }
        }

        myPlace = {
          ...found,
          isTop5: found.rank <= 5,
          isTop10: found.rank <= 10,
          percentile: Math.max(1, Math.round((found.rank / Math.max(rankingData.totalCount, rankingData.items.length)) * 100)),
        };
      }
    }

    // 4. 1위 매장 vs 내 매장 5대 핵심 지표 정량 격차 분석 (Gap Analysis - 미수집 항목 정직 판정)
    let gapAnalysis: PlaceGapAnalysis | null = null;
    if (myPlace && rankingData.items.length > 0) {
      const top1 = rankingData.items[0];

      const parseNum = (str?: string): number => {
        if (!str || str === '-' || str === '미집계') return 0;
        const num = str.replace(/[^0-9]/g, '');
        return num ? parseInt(num, 10) : 0;
      };

      const hasValidNum = (str?: string): boolean => {
        if (!str || str === '-' || str === '미집계') return false;
        return /[0-9]/.test(str);
      };

      // 1) 저장수 판정
      const top1HasSaves = hasValidNum(top1.saveCount);
      const myHasSaves = hasValidNum(myPlace.saveCount);
      const top1Saves = parseNum(top1.saveCount);
      const mySaves = parseNum(myPlace.saveCount);
      const savesGap = top1Saves - mySaves;
      const savesStatus: MetricStatus = (!top1HasSaves && !myHasSaves)
        ? 'UNMEASURED'
        : (savesGap > 0 ? 'DEFICIT' : 'OPTIMAL');

      // 2) 방문자리뷰 판정
      const top1HasVisitor = hasValidNum(top1.visitorReviews);
      const myHasVisitor = hasValidNum(myPlace.visitorReviews);
      const top1Visitor = parseNum(top1.visitorReviews);
      const myVisitor = parseNum(myPlace.visitorReviews);
      const visitorGap = top1Visitor - myVisitor;
      const visitorStatus: MetricStatus = (!top1HasVisitor && !myHasVisitor)
        ? 'UNMEASURED'
        : (visitorGap > 0 ? 'DEFICIT' : 'OPTIMAL');

      // 3) 블로그리뷰 판정
      const top1HasBlog = hasValidNum(top1.blogReviews);
      const myHasBlog = hasValidNum(myPlace.blogReviews);
      const top1Blog = parseNum(top1.blogReviews);
      const myBlog = parseNum(myPlace.blogReviews);
      const blogGap = top1Blog - myBlog;
      const blogStatus: MetricStatus = (!top1HasBlog && !myHasBlog)
        ? 'UNMEASURED'
        : (blogGap > 0 ? 'DEFICIT' : 'OPTIMAL');

      gapAnalysis = {
        top1Name: top1.name,
        isRank1: myPlace.rank === 1,
        metrics: {
          saves: {
            top1: top1.saveCount || '-',
            my: myPlace.saveCount || '-',
            diff: savesStatus === 'UNMEASURED' ? 0 : (savesGap > 0 ? savesGap : 0),
            status: savesStatus,
          },
          visitorReviews: {
            top1: top1.visitorReviews || '-',
            my: myPlace.visitorReviews || '-',
            diff: visitorStatus === 'UNMEASURED' ? 0 : (visitorGap > 0 ? visitorGap : 0),
            status: visitorStatus,
          },
          blogReviews: {
            top1: top1.blogReviews || '-',
            my: myPlace.blogReviews || '-',
            diff: blogStatus === 'UNMEASURED' ? 0 : (blogGap > 0 ? blogGap : 0),
            status: blogStatus,
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

    // 5. 플레이스싱크 AI 순위 정체 원인 & 1위 동기화 전략 산출
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

    const top5Places = rankingData.items.slice(0, 5).map(item => ({
      rank: item.rank,
      id: item.id,
      name: item.name,
      visitorReviews: item.visitorReviews,
      blogReviews: item.blogReviews,
      hasBooking: item.hasBooking,
      hasCoupon: item.hasCoupon,
      saveCount: item.saveCount
    }));

    return NextResponse.json({
      success: true,
      query: cleanQuery,
      target: cleanTarget,
      totalCount: rankingData.totalCount,
      searchDate: new Date().toISOString(),
      searchVolume,
      myPlace,
      gapAnalysis,
      jevDiagnosis,
      top5Places,
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
