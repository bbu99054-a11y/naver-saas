import { google } from "googleapis";
import { getGoogleAuthClient } from "./auth";

const DEFAULT_SITE_URL = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || "https://www.postsyncapp.com/";

export interface SearchConsolePerformanceOptions {
  siteUrl?: string;
  days?: number;
  rowLimit?: number;
}

export interface SearchQueryMetric {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SearchConsoleSummary {
  siteUrl: string;
  startDate: string;
  endDate: string;
  totalClicks: number;
  totalImpressions: number;
  averageCtr: number;
  averagePosition: number;
  topQueries: SearchQueryMetric[];
}

export interface QueryPageMetric {
  query: string;
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface LowCtrCandidate {
  query: string;
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  benchmarkCtr: number;
  position: number;
}

export interface StrikingDistanceCandidate {
  query: string;
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  potentialClicks: number;
}

export interface CannibalizationCandidate {
  query: string;
  totalClicks: number;
  totalImpressions: number;
  conflictScore: number;
  pages: Array<{
    page: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
}

const CTR_BENCHMARK_BY_POS: Record<number, number> = {
  1: 30.0,
  2: 15.0,
  3: 10.0,
  4: 6.0,
  5: 4.0,
  6: 3.0,
  7: 2.5,
  8: 2.0,
  9: 1.5,
  10: 1.2,
};

function formatDateYmd(dateObj: Date): string {
  return dateObj.toISOString().split("T")[0];
}

/**
 * 구글 서치콘솔의 검색 실적 지표(노출수, 클릭수, 순위, 인기 검색어)를 조회합니다.
 */
export async function getSearchConsolePerformance(
  options: SearchConsolePerformanceOptions = {}
): Promise<SearchConsoleSummary> {
  const { siteUrl = DEFAULT_SITE_URL, days = 28, rowLimit = 20 } = options;

  const authClient = await getGoogleAuthClient();
  const searchconsole = google.searchconsole({ version: "v1", auth: authClient as any });

  const endDateObj = new Date();
  const startDateObj = new Date(endDateObj.getTime() - days * 24 * 60 * 60 * 1000);

  const startDate = startDateObj.toISOString().split("T")[0];
  const endDate = endDateObj.toISOString().split("T")[0];

  const response = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ["query"],
      rowLimit,
    },
  });

  const rows = response.data.rows || [];

  let totalClicks = 0;
  let totalImpressions = 0;
  let weightedPositionSum = 0;

  const topQueries: SearchQueryMetric[] = rows.map((row) => {
    const clicks = row.clicks || 0;
    const impressions = row.impressions || 0;
    const ctr = row.ctr || 0;
    const position = row.position || 0;

    totalClicks += clicks;
    totalImpressions += impressions;
    weightedPositionSum += position * impressions;

    return {
      query: (row.keys && row.keys[0]) || "",
      clicks,
      impressions,
      ctr: Math.round(ctr * 10000) / 100, // 백분율 소수점 2자리
      position: Math.round(position * 10) / 10,
    };
  });

  const averageCtr = totalImpressions > 0 ? Math.round((totalClicks / totalImpressions) * 10000) / 100 : 0;
  const averagePosition =
    totalImpressions > 0 ? Math.round((weightedPositionSum / totalImpressions) * 10) / 10 : 0;

  return {
    siteUrl,
    startDate,
    endDate,
    totalClicks,
    totalImpressions,
    averageCtr,
    averagePosition,
    topQueries,
  };
}

/**
 * 구글 서치콘솔에서 쿼리 × 페이지(URL) 교차 매트릭스를 조회합니다. (3일 집계 지연 자동 반영)
 */
export async function getQueryPageMatrix(
  options: { siteUrl?: string; days?: number; rowLimit?: number; delayDays?: number } = {}
): Promise<{ startDate: string; endDate: string; rows: QueryPageMetric[] }> {
  const { siteUrl = DEFAULT_SITE_URL, days = 28, rowLimit = 5000, delayDays = 3 } = options;

  const authClient = await getGoogleAuthClient();
  const searchconsole = google.searchconsole({ version: "v1", auth: authClient as any });

  const endDateObj = new Date();
  endDateObj.setDate(endDateObj.getDate() - delayDays);
  const startDateObj = new Date(endDateObj);
  startDateObj.setDate(startDateObj.getDate() - days);

  const startDate = formatDateYmd(startDateObj);
  const endDate = formatDateYmd(endDateObj);

  const response = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ["query", "page"],
      rowLimit,
    },
  });

  const rawRows = response.data.rows || [];
  const rows: QueryPageMetric[] = rawRows.map((row) => ({
    query: (row.keys && row.keys[0]) || "",
    page: (row.keys && row.keys[1]) || "",
    clicks: row.clicks || 0,
    impressions: row.impressions || 0,
    ctr: Math.round((row.ctr || 0) * 10000) / 100,
    position: Math.round((row.position || 0) * 10) / 10,
  }));

  return { startDate, endDate, rows };
}

/**
 * [CASE_2] 1페이지(또는 상위 노출권)이나 기대 CTR 대비 클릭률이 현저히 낮은 스니펫 교정 대상 추출
 */
export function detectLowCtrOpportunities(
  rows: QueryPageMetric[],
  minImpressions: number = 15
): LowCtrCandidate[] {
  return rows
    .filter((r) => r.impressions >= minImpressions && r.position <= 12)
    .map((r) => {
      const roundedPos = Math.max(1, Math.min(10, Math.round(r.position)));
      const benchmarkCtr = CTR_BENCHMARK_BY_POS[roundedPos] || 1.2;
      return {
        ...r,
        benchmarkCtr,
      };
    })
    .filter((item) => item.ctr < item.benchmarkCtr * 0.6)
    .sort((a, b) => b.impressions - a.impressions);
}

/**
 * [CASE_3] 1페이지 진입 목전(8위 ~ 25위)에 위치한 Striking Distance 보강 대상 추출
 */
export function detectStrikingDistance(
  rows: QueryPageMetric[],
  minImpressions: number = 15
): StrikingDistanceCandidate[] {
  return rows
    .filter((r) => r.position >= 8 && r.position <= 25 && r.impressions >= minImpressions)
    .map((r) => {
      const potentialClicks = Math.max(0, Math.round(r.impressions * 0.15) - r.clicks);
      return {
        ...r,
        potentialClicks,
      };
    })
    .sort((a, b) => b.potentialClicks - a.potentialClicks || b.impressions - a.impressions);
}

/**
 * [CASE_4] 동일 키워드에 2개 이상의 URL이 경쟁하여 점수가 분산되는 카니발리제이션(HHI 지수 기반) 감지
 */
export function detectKeywordCannibalization(
  rows: QueryPageMetric[],
  minImpressions: number = 15
): CannibalizationCandidate[] {
  const queryMap = new Map<string, QueryPageMetric[]>();

  for (const r of rows) {
    if (r.impressions < minImpressions) continue;
    const list = queryMap.get(r.query) || [];
    list.push(r);
    queryMap.set(r.query, list);
  }

  const results: CannibalizationCandidate[] = [];

  for (const [query, pages] of queryMap.entries()) {
    if (pages.length < 2) continue;
    pages.sort((a, b) => b.impressions - a.impressions);

    const totalClicks = pages.reduce((sum, p) => sum + p.clicks, 0);
    const totalImpressions = pages.reduce((sum, p) => sum + p.impressions, 0);

    // 클릭이 0인 초기 단계에서는 노출 점유율(Impression Share)로 HHI 분산도 산출
    const shares = pages.map((p) =>
      totalClicks > 0 ? p.clicks / totalClicks : totalImpressions > 0 ? p.impressions / totalImpressions : 0
    );
    const hhi = shares.reduce((sum, s) => sum + s * s, 0);
    const conflictScore = Math.round((1 - hhi) * 100) / 100;

    if (conflictScore >= 0.15 || pages[1].impressions >= pages[0].impressions * 0.2) {
      results.push({
        query,
        totalClicks,
        totalImpressions,
        conflictScore,
        pages: pages.map((p) => ({
          page: p.page,
          clicks: p.clicks,
          impressions: p.impressions,
          ctr: p.ctr,
          position: p.position,
        })),
      });
    }
  }

  return results.sort((a, b) => b.totalImpressions * b.conflictScore - a.totalImpressions * a.conflictScore);
}
