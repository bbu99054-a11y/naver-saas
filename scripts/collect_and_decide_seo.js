/**
 * PostSync A-to-Z 일일 SEO 데이터 수집 · 경쟁사 감시 · 자율 판단 엔진 (Decision Engine)
 *
 * 실행 방법:
 *   node scripts/collect_and_decide_seo.js
 *   node scripts/collect_and_decide_seo.js --notify-noop
 *
 * 동작 단계:
 *   1. GSC API (쿼리×페이지 매트릭스, 14일 추세 비교, 일자별 Z-Score 이상치) 수집
 *   2. GA4 Data API (페이지별 조회수, 평균 체류시간, 이탈률) 수집
 *   3. 네이버 서치어드바이저 크롬 스냅샷(src/data/seo-snapshots/naver-latest.json) 병합
 *   4. 경쟁사 3곳(마케팅마법사, 순위닥터, SNS서포터) sitemap.xml 크롤링 및 주간 신규 발행/색인 비교
 *   5. 14일 수정 잠금(Cooldown Lock) 필터링 후 7대 판단 공식(CASE_0 ~ CASE_6) 실행
 *   6. src/data/seo-snapshots/YYYY-MM-DD.json 및 src/data/pending-seo-action.json 저장
 */

const path = require("path");
const fs = require("fs");
const net = require("net");
const { google } = require("googleapis");

// Windows IPv6 Happy Eyeballs 타임아웃(ETIMEDOUT) 방지
net.setDefaultAutoSelectFamily(false);

// 1. .env.local 환경변수 로드
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  });
}

const ROOT_DIR = path.resolve(__dirname, "..");
const TRACKER_PATH = path.resolve(ROOT_DIR, "src/data/seo-tracker.json");
const COMPETITOR_PATH = path.resolve(ROOT_DIR, "src/data/competitor-snapshots.json");
const SNAPSHOT_DIR = path.resolve(ROOT_DIR, "src/data/seo-snapshots");
const NAVER_REPO_PATH = path.resolve(ROOT_DIR, "src/data/naver-latest.json");
const NAVER_SNAPSHOT_PATH = path.resolve(SNAPSHOT_DIR, "naver-latest.json");
const PENDING_ACTION_PATH = path.resolve(ROOT_DIR, "src/data/pending-seo-action.json");

// 301 리다이렉트 및 비SEO 법무·인증 페이지 제외 목록
const IGNORED_PATHS = new Set([
  "/seo-check",
  "/tools/adcheck",
  "/thumbscan",
  "/login",
  "/pricing",
  "/consult",
  "/onboarding",
  "/terms",
  "/privacy",
  "/contact",
  "/dashboard",
]);

function isIgnoredPath(pagePath) {
  if (!pagePath) return false;
  return IGNORED_PATHS.has(pagePath) || pagePath.startsWith("/dashboard/");
}

function isPlaceRelated(targetPath, query, trackerEntry) {
  if (trackerEntry?.isPlaceCore === true || trackerEntry?.type === "pseo") return true;
  if (["/place", "/utm", "/reply", "/adcheck"].includes(targetPath)) return true;
  if (targetPath && targetPath.toLowerCase().includes("place")) return true;
  if (query && /플레이스|스마트플레이스|place|리뷰|영수증|저장수|예약|상권|방문자/i.test(query)) return true;
  return false;
}

function hasDedicatedPostForQuery(query, entries) {
  const normalizedQ = query.replace(/\s+/g, "").toLowerCase();
  const qTokens = query
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);

  // 플레이스 순위 조회·체크 계열 의도 클러스터 중복 생성 방지 (/place 및 p01과 카니발리제이션 방지)
  const isPlaceRankIntent =
    normalizedQ.includes("플레이스") &&
    normalizedQ.includes("순위") &&
    /(체크|조회|확인|추적|검색|측정|분석|프로그램|어플|사이트)/.test(normalizedQ);

  for (const entry of entries || []) {
    if (isPlaceRankIntent && (entry.slug === "/place" || (entry.primaryKeyword || "").includes("플레이스 순위"))) {
      return true;
    }

    const keywords = [entry.primaryKeyword, ...(entry.secondaryKeywords || [])].filter(Boolean);
    for (const kw of keywords) {
      const normalizedKw = kw.replace(/\s+/g, "").toLowerCase();
      if (normalizedKw === normalizedQ || (normalizedKw.includes(normalizedQ) && normalizedQ.length >= 8)) {
        return true;
      }
    }

    if (qTokens.length >= 2) {
      const entryText = `${entry.title || ""} ${keywords.join(" ")}`.toLowerCase();
      const matched = qTokens.filter((tok) => entryText.includes(tok));
      if (matched.length / qTokens.length >= 0.75) {
        return true;
      }
    }
  }
  return false;
}

const COMPETITORS = [
  {
    id: "placewizard",
    name: "마케팅마법사",
    domain: "placewizard.kr",
    sitemapUrl: "https://placewizard.kr/sitemap.xml",
  },
  {
    id: "rankdoctor",
    name: "순위닥터",
    domain: "rankdoctor.co.kr",
    sitemapUrl: "https://rankdoctor.co.kr/sitemap.xml",
  },
  {
    id: "snssupporter",
    name: "SNS서포터",
    domain: "snssupporter.com",
    sitemapUrl: "https://snssupporter.com/sitemap.xml",
  },
];

// 순위별 기대 CTR 벤치마크 (%)
const CTR_BENCHMARK_BY_POS = {
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

function toYmd(dateObj) {
  return dateObj.toISOString().split("T")[0];
}

function daysBetween(dateStrA, dateStrB) {
  const a = new Date(dateStrA);
  const b = new Date(dateStrB);
  return Math.floor(Math.abs(b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function normalizePathFromUrl(urlStr) {
  try {
    const u = new URL(urlStr);
    return u.pathname.replace(/\/+$/, "") || "/";
  } catch {
    return (urlStr || "").replace(/\/+$/, "") || "/";
  }
}

async function sendTelegramPlain(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
}

/**
 * 경쟁사 3곳의 sitemap.xml을 크롤링하여 전체 색인 대상 URL 수 및 주간 신규 발행 URL을 추출합니다.
 */
async function checkCompetitorSitemaps() {
  let prevData = { updatedAt: null, competitors: {} };
  if (fs.existsSync(COMPETITOR_PATH)) {
    try {
      prevData = JSON.parse(fs.readFileSync(COMPETITOR_PATH, "utf8"));
    } catch {
      // 파싱 실패 시 초기화
    }
  }

  const todayStr = toYmd(new Date());
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const report = {};
  const nextCompetitorsState = {};

  for (const comp of COMPETITORS) {
    try {
      const res = await fetch(comp.sitemapUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; PostSyncSEOBot/1.0)" },
        signal: AbortSignal.timeout(8000),
      });

      if (!res.ok) {
        report[comp.id] = {
          name: comp.name,
          domain: comp.domain,
          status: `HTTP_${res.status}`,
          totalUrls: 0,
          weeklyActiveCount: 0,
          newlyAddedSinceLastCheck: 0,
          newUrlsSample: [],
        };
        continue;
      }

      const xml = await res.text();
      const urlBlockRegex = /<url>([\s\S]*?)<\/url>/g;
      const urls = [];
      const recentByLastmod = [];
      let match;

      while ((match = urlBlockRegex.exec(xml)) !== null) {
        const block = match[1];
        const locMatch = block.match(/<loc>(.*?)<\/loc>/);
        const modMatch = block.match(/<lastmod>(.*?)<\/lastmod>/);
        if (locMatch && locMatch[1]) {
          const loc = locMatch[1].trim();
          urls.push(loc);
          if (modMatch && modMatch[1]) {
            const modDate = new Date(modMatch[1].trim());
            if (!isNaN(modDate.getTime()) && modDate >= sevenDaysAgo) {
              recentByLastmod.push(loc);
            }
          }
        }
      }

      // 만약 <url> 블록 없이 <loc>만 있는 경우 폴백 파싱
      if (urls.length === 0) {
        const locOnlyRegex = /<loc>(.*?)<\/loc>/g;
        while ((match = locOnlyRegex.exec(xml)) !== null) {
          urls.push(match[1].trim());
        }
      }

      const prevComp = prevData.competitors?.[comp.id];
      const prevUrlSet = new Set(prevComp?.knownUrls || []);
      const diffNewUrls = prevUrlSet.size > 0 ? urls.filter((u) => !prevUrlSet.has(u)) : [];
      const sampleSource = diffNewUrls.length > 0 ? diffNewUrls : recentByLastmod;

      // 우리 도메인과 연관된 플레이스/순위/리뷰/세무/병의원/변호사 관련 슬러그 필터링
      const relevantKeywords = ["place", "rank", "review", "naver", "hospital", "clinic", "tax", "lawyer", "legal", "geo", "blog"];
      const relevantNewUrls = sampleSource.filter((u) =>
        relevantKeywords.some((kw) => u.toLowerCase().includes(kw))
      );

      report[comp.id] = {
        name: comp.name,
        domain: comp.domain,
        status: "OK",
        totalUrls: urls.length,
        previousTotalUrls: prevComp?.totalUrls ?? urls.length,
        newlyAddedSinceLastCheck: diffNewUrls.length,
        weeklyActiveCount: recentByLastmod.length,
        newUrlsSample: sampleSource.slice(-5),
        relevantNewUrls: relevantNewUrls.slice(-5),
      };

      nextCompetitorsState[comp.id] = {
        name: comp.name,
        domain: comp.domain,
        lastCheckedDate: todayStr,
        totalUrls: urls.length,
        knownUrls: urls.slice(-2000),
      };
    } catch (err) {
      report[comp.id] = {
        name: comp.name,
        domain: comp.domain,
        status: `ERROR: ${err.message}`,
        totalUrls: 0,
        weeklyActiveCount: 0,
        newlyAddedSinceLastCheck: 0,
        newUrlsSample: [],
      };
      if (prevData.competitors?.[comp.id]) {
        nextCompetitorsState[comp.id] = prevData.competitors[comp.id];
      }
    }
  }

  fs.mkdirSync(path.dirname(COMPETITOR_PATH), { recursive: true });
  fs.writeFileSync(
    COMPETITOR_PATH,
    JSON.stringify({ updatedAt: new Date().toISOString(), competitors: nextCompetitorsState }, null, 2),
    "utf8"
  );

  return report;
}

/**
 * 일자별 클릭/노출 시계열에서 Z-Score 이상치(급등/급락)를 계산합니다.
 */
function detectDailyAnomalies(dailyRows) {
  if (!dailyRows || dailyRows.length < 5) return [];
  const impressions = dailyRows.map((r) => r.impressions || 0);
  const avgImp = impressions.reduce((a, b) => a + b, 0) / impressions.length;
  const variance = impressions.reduce((a, b) => a + Math.pow(b - avgImp, 2), 0) / impressions.length;
  const stdDev = Math.sqrt(variance);

  const anomalies = [];
  for (const r of dailyRows) {
    const imp = r.impressions || 0;
    const zScore = stdDev === 0 ? 0 : (imp - avgImp) / stdDev;
    if (Math.abs(zScore) >= 1.8) {
      anomalies.push({
        date: r.keys?.[0] || "",
        metric: "impressions",
        value: imp,
        expectedValue: Math.round(avgImp),
        zScore: Math.round(zScore * 100) / 100,
        type: zScore > 0 ? "SPIKE" : "DROP",
      });
    }
  }
  return anomalies.slice(-3);
}

async function main() {
  const notifyNoop = process.argv.includes("--notify-noop");
  const keyPath = path.resolve(ROOT_DIR, "postsync-api-9be9a8c8fa03.json");
  const propertyId = process.env.GA4_PROPERTY_ID || "546100897";
  const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || "https://www.postsyncapp.com/";

  const credentials = JSON.parse(fs.readFileSync(keyPath, "utf8"));
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: [
      "https://www.googleapis.com/auth/webmasters.readonly",
      "https://www.googleapis.com/auth/analytics.readonly",
    ],
  });

  const authClient = await auth.getClient();
  const analyticsdata = google.analyticsdata({ version: "v1beta", auth: authClient });
  const searchconsole = google.searchconsole({ version: "v1", auth: authClient });

  const today = new Date();
  const todayStr = toYmd(today);

  // GSC 90일(누적 검색어 풀) 및 최근 14일 vs 직전 14일 추세 비교
  const endFresh = new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000);
  const start90d = new Date(endFresh.getTime() - 90 * 24 * 60 * 60 * 1000);
  const start28d = new Date(endFresh.getTime() - 28 * 24 * 60 * 60 * 1000);
  const start14d = new Date(endFresh.getTime() - 14 * 24 * 60 * 60 * 1000);
  const startPrev14d = new Date(start14d.getTime() - 14 * 24 * 60 * 60 * 1000);
  const endPrev14d = new Date(start14d.getTime() - 1 * 24 * 60 * 60 * 1000);

  console.log("[1/5] 구글 서치콘솔(GSC) 다차원 데이터 수집 중...");
  const [gscQueryPageRes, gscQueryOnlyRes, gscPageOnlyRes, gscDailyRes, gscRecent14Res, gscPrev14Res] =
    await Promise.all([
      searchconsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: toYmd(start90d),
          endDate: toYmd(endFresh),
          dimensions: ["query", "page"],
          dataState: "all",
          rowLimit: 5000,
        },
      }),
      searchconsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: toYmd(start90d),
          endDate: toYmd(endFresh),
          dimensions: ["query"],
          dataState: "all",
          rowLimit: 2000,
        },
      }),
      searchconsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: toYmd(start90d),
          endDate: toYmd(endFresh),
          dimensions: ["page"],
          dataState: "all",
          rowLimit: 1000,
        },
      }),
      searchconsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: toYmd(start28d),
          endDate: toYmd(endFresh),
          dimensions: ["date"],
          dataState: "all",
          rowLimit: 100,
        },
      }),
      searchconsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: toYmd(start14d),
          endDate: toYmd(endFresh),
          dimensions: ["page"],
          dataState: "all",
          rowLimit: 500,
        },
      }),
      searchconsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: toYmd(startPrev14d),
          endDate: toYmd(endPrev14d),
          dimensions: ["page"],
          dataState: "all",
          rowLimit: 500,
        },
      }),
    ]);

  // GSC는 클릭이 0일 때 알파벳순으로 반환하므로 반드시 노출수(impressions) 내림차순 정렬 수행
  const queryPageRows = (gscQueryPageRes.data.rows || [])
    .map((r) => ({
      query: r.keys?.[0] || "",
      page: r.keys?.[1] || "",
      pagePath: normalizePathFromUrl(r.keys?.[1] || ""),
      clicks: r.clicks || 0,
      impressions: r.impressions || 0,
      ctr: Math.round((r.ctr || 0) * 10000) / 100,
      position: Math.round((r.position || 0) * 10) / 10,
    }))
    .sort((a, b) => b.impressions - a.impressions || b.clicks - a.clicks);

  const queryRows = (gscQueryOnlyRes.data.rows || [])
    .map((r) => ({
      query: r.keys?.[0] || "",
      clicks: r.clicks || 0,
      impressions: r.impressions || 0,
      ctr: Math.round((r.ctr || 0) * 10000) / 100,
      position: Math.round((r.position || 0) * 10) / 10,
    }))
    .sort((a, b) => b.impressions - a.impressions || b.clicks - a.clicks);

  const pageRows = (gscPageOnlyRes.data.rows || [])
    .map((r) => ({
      page: r.keys?.[0] || "",
      pagePath: normalizePathFromUrl(r.keys?.[0] || ""),
      clicks: r.clicks || 0,
      impressions: r.impressions || 0,
      ctr: Math.round((r.ctr || 0) * 10000) / 100,
      position: Math.round((r.position || 0) * 10) / 10,
    }))
    .sort((a, b) => b.impressions - a.impressions || b.clicks - a.clicks);

  const anomalies = detectDailyAnomalies(gscDailyRes.data.rows || []);

  console.log("[2/5] GA4 페이지별 체류시간·이탈률·트래픽 지표 수집 중...");
  const ga4PagesRes = await analyticsdata.properties.runReport({
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [{ startDate: "14daysAgo", endDate: "yesterday" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [
        { name: "screenPageViews" },
        { name: "sessions" },
        { name: "averageSessionDuration" },
        { name: "bounceRate" },
      ],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: "200",
    },
  });

  const ga4PageMap = new Map();
  for (const row of ga4PagesRes.data.rows || []) {
    const p = (row.dimensionValues?.[0]?.value || "/").replace(/\/+$/, "") || "/";
    ga4PageMap.set(p, {
      views: parseInt(row.metricValues?.[0]?.value || "0", 10),
      sessions: parseInt(row.metricValues?.[1]?.value || "0", 10),
      avgDurationSec: Math.round(parseFloat(row.metricValues?.[2]?.value || "0")),
      bounceRate: Math.round(parseFloat(row.metricValues?.[3]?.value || "0") * 1000) / 10,
    });
  }

  console.log("[3/5] 네이버 서치어드바이저 스냅샷 확인 중...");
  let naverSnapshot = null;
  const naverFileToRead = fs.existsSync(NAVER_REPO_PATH)
    ? NAVER_REPO_PATH
    : fs.existsSync(NAVER_SNAPSHOT_PATH)
      ? NAVER_SNAPSHOT_PATH
      : null;
  if (naverFileToRead) {
    try {
      naverSnapshot = JSON.parse(fs.readFileSync(naverFileToRead, "utf8"));
    } catch {
      naverSnapshot = null;
    }
  }

  console.log("[4/5] 경쟁사 3곳(마케팅마법사, 순위닥터, SNS서포터) 사이트맵 및 주간 발행량 분석 중...");
  const competitorReport = await checkCompetitorSitemaps();

  console.log("[5/5] A-to-Z SEO 의사결정 엔진(CASE_0 ~ CASE_8, 플레이스 우선 가중치) 실행 중...");
  const tracker = JSON.parse(fs.readFileSync(TRACKER_PATH, "utf8"));
  const cooldownDays = tracker.policy?.cooldownDays ?? 14;
  const minImp = tracker.policy?.minImpressionsForLowCtr ?? 15;

  // 슬러그/경로별 트래커 매핑 및 14일 쿨다운 판정
  const entryByPath = new Map();
  for (const entry of tracker.entries || []) {
    const p = entry.slug.startsWith("/") ? entry.slug : `/blog/${entry.slug}`;
    const daysSinceMod = daysBetween(entry.lastModifiedAt || entry.publishedAt, todayStr);
    const isCooldownLocked = daysSinceMod < cooldownDays;
    entryByPath.set(p, {
      ...entry,
      pagePath: p,
      daysSinceMod,
      isCooldownLocked,
    });
  }

  // 쿼리별로 가장 많이 노출된 대표 페이지 매핑
  const topPageByQuery = new Map();
  for (const r of queryPageRows) {
    const existing = topPageByQuery.get(r.query);
    if (!existing || r.impressions > existing.impressions) {
      topPageByQuery.set(r.query, r);
    }
  }

  const candidateActions = [];

  // -------------------------------------------------------------------------
  // CASE_2: CTR_REWRITE (1~2페이지(20위 이내)에서 기대 CTR 미달 또는 노출 35회+ 클릭 0건)
  // -------------------------------------------------------------------------
  for (const qRow of queryRows) {
    if (qRow.impressions < minImp) continue;
    const mapped = topPageByQuery.get(qRow.query);
    const targetPath = mapped?.pagePath || "/place";
    if (isIgnoredPath(targetPath)) continue;
    const trackerEntry = entryByPath.get(targetPath);

    const roundedPos = Math.max(1, Math.min(10, Math.round(qRow.position)));
    const benchmarkCtr = qRow.position <= 10 ? CTR_BENCHMARK_BY_POS[roundedPos] || 1.5 : 3.0;

    // 20위 이내(1~2페이지)에서만 타이틀/메타 CTR 리라이트 대상으로 판정
    const isSevereZeroClick = qRow.position <= 20 && qRow.impressions >= 35 && qRow.clicks === 0;
    const isLowCtrOnPageOne = qRow.position <= 12 && qRow.ctr < benchmarkCtr * 0.6;

    if (isSevereZeroClick || isLowCtrOnPageOne) {
      if (trackerEntry && trackerEntry.isCooldownLocked) continue;

      const impactScore = qRow.impressions * 0.9;
      candidateActions.push({
        caseCode: "CASE_2",
        actionType: "CTR_REWRITE",
        priorityScore: Math.round(impactScore * 10) / 10,
        targetPath,
        targetSlug: trackerEntry?.slug || targetPath,
        targetTitle: trackerEntry?.title || "",
        triggerQuery: qRow.query,
        metrics: {
          impressions: qRow.impressions,
          clicks: qRow.clicks,
          ctr: qRow.ctr,
          benchmarkCtr,
          position: qRow.position,
        },
        reason: `검색어 '${qRow.query}'에서 ${qRow.impressions}회 노출되었으나 클릭이 ${qRow.clicks}회(CTR ${qRow.ctr}%, 평균 ${qRow.position}위)에 그침. Title·Excerpt 및 연관 pSEO 칼럼 도입부에 '${qRow.query}' 원형과 클릭 유도 훅 반영 필요.`,
      });
    }
  }

  // -------------------------------------------------------------------------
  // CASE_7: RANK_BOOST (노출 >= 35회인데 20위 밖(3페이지 이후)에 머물러 1페이지 도약이 필요한 키워드)
  // -------------------------------------------------------------------------
  for (const qRow of queryRows) {
    if (qRow.impressions < 35 || qRow.position <= 20) continue;
    const mapped = topPageByQuery.get(qRow.query);
    const targetPath = mapped?.pagePath || "/place";
    if (isIgnoredPath(targetPath)) continue;
    const trackerEntry = entryByPath.get(targetPath);
    if (trackerEntry && trackerEntry.isCooldownLocked) continue;

    const impactScore = qRow.impressions * 0.8;
    candidateActions.push({
      caseCode: "CASE_7",
      actionType: "RANK_BOOST",
      priorityScore: Math.round(impactScore * 10) / 10,
      targetPath,
      targetSlug: trackerEntry?.slug || targetPath,
      targetTitle: trackerEntry?.title || "",
      triggerQuery: qRow.query,
      metrics: {
        impressions: qRow.impressions,
        clicks: qRow.clicks,
        ctr: qRow.ctr,
        position: qRow.position,
      },
      reason: `'${qRow.query}' 키워드가 ${qRow.impressions}회 노출되고 있으나 평균 ${qRow.position}위(3페이지 밖)로 순위 약세가 뚜렷함. 단순 타이틀 수정이 아닌 '${qRow.query}' 맞춤 H2 비교 섹션 보강 및 내부링크 집중이 필요함.`,
    });
  }

  // -------------------------------------------------------------------------
  // CASE_3: STRIKING_DISTANCE (순위 8위~25위, 1페이지 진입 목전 키워드 보강)
  // -------------------------------------------------------------------------
  for (const qp of queryPageRows) {
    if (qp.impressions < 10) continue;
    if (isIgnoredPath(qp.pagePath)) continue;
    if (qp.position >= 8 && qp.position <= 25) {
      const trackerEntry = entryByPath.get(qp.pagePath);
      if (trackerEntry && trackerEntry.isCooldownLocked) continue;

      const potentialClicks = Math.max(1, Math.round(qp.impressions * 0.15) - qp.clicks);
      const ga4Info = ga4PageMap.get(qp.pagePath);

      candidateActions.push({
        caseCode: "CASE_3",
        actionType: "STRIKING_DISTANCE",
        priorityScore: Math.round((potentialClicks * 5 + qp.impressions * 0.5) * 10) / 10,
        targetPath: qp.pagePath,
        targetSlug: trackerEntry?.slug || qp.pagePath,
        targetTitle: trackerEntry?.title || "",
        triggerQuery: qp.query,
        metrics: {
          impressions: qp.impressions,
          clicks: qp.clicks,
          ctr: qp.ctr,
          position: qp.position,
          potentialClicks,
          ga4AvgDurationSec: ga4Info?.avgDurationSec ?? null,
        },
        reason: `'${qp.query}' 키워드가 현재 평균 ${qp.position}위(노출 ${qp.impressions}회, 클릭 ${qp.clicks}회)로 1페이지 상위권 진입 목전에 위치함. '${qp.query}' 맞춤 H2 소제목 섹션과 정량 비교표를 보강하여 TOP 5 진입 유도.`,
      });
    }
  }

  // -------------------------------------------------------------------------
  // CASE_4: CANNIBALIZATION (동일 검색어에 2개 이상 페이지 노출 분산)
  // -------------------------------------------------------------------------
  const pagesByQuery = new Map();
  for (const qp of queryPageRows) {
    if (qp.impressions < 10 || isIgnoredPath(qp.pagePath)) continue;
    const arr = pagesByQuery.get(qp.query) || [];
    arr.push(qp);
    pagesByQuery.set(qp.query, arr);
  }

  for (const [query, pages] of pagesByQuery.entries()) {
    if (pages.length < 2) continue;
    pages.sort((a, b) => b.impressions - a.impressions);
    const totalImp = pages.reduce((s, p) => s + p.impressions, 0);
    const shares = pages.map((p) => (totalImp > 0 ? p.impressions / totalImp : 0));
    const hhi = shares.reduce((s, sh) => s + sh * sh, 0);
    const conflictScore = Math.round((1 - hhi) * 100) / 100;

    if (conflictScore >= 0.15 && pages[1].impressions >= 10) {
      const secondaryPage = pages[1];
      const trackerEntry = entryByPath.get(secondaryPage.pagePath);
      if (trackerEntry && trackerEntry.isCooldownLocked) continue;

      candidateActions.push({
        caseCode: "CASE_4",
        actionType: "CANNIBALIZATION",
        priorityScore: Math.round(totalImp * conflictScore * 10) / 10,
        targetPath: secondaryPage.pagePath,
        targetSlug: trackerEntry?.slug || secondaryPage.pagePath,
        primaryWinnerPath: pages[0].pagePath,
        triggerQuery: query,
        metrics: {
          totalImpressions: totalImp,
          conflictScore,
          competingPages: pages.map((p) => ({
            path: p.pagePath,
            impressions: p.impressions,
            position: p.position,
          })),
        },
        reason: `'${query}' 검색어에서 ${pages[0].pagePath}(${pages[0].impressions}회)와 ${secondaryPage.pagePath}(${secondaryPage.impressions}회)가 동시 노출되어 점수가 분산됨(충돌지수 ${conflictScore}). 보조 글의 타겟 키워드를 세분화하고 대표 글로 내부링크 집중 필요.`,
      });
    }
  }

  // -------------------------------------------------------------------------
  // CASE_5: CONTENT_DECAY (최근 14일 vs 직전 14일 노출/클릭 30% 이상 급락)
  // -------------------------------------------------------------------------
  const recent14Map = new Map(
    (gscRecent14Res.data.rows || []).map((r) => [normalizePathFromUrl(r.keys?.[0] || ""), r])
  );
  const prev14Map = new Map(
    (gscPrev14Res.data.rows || []).map((r) => [normalizePathFromUrl(r.keys?.[0] || ""), r])
  );

  for (const [pagePath, prevRow] of prev14Map.entries()) {
    if (isIgnoredPath(pagePath)) continue;
    const prevImp = prevRow.impressions || 0;
    if (prevImp < 25) continue;
    const currRow = recent14Map.get(pagePath);
    const currImp = currRow?.impressions || 0;
    const dropRate = Math.round(((prevImp - currImp) / prevImp) * 100);

    if (dropRate >= 30) {
      const trackerEntry = entryByPath.get(pagePath);
      if (trackerEntry && trackerEntry.isCooldownLocked) continue;

      candidateActions.push({
        caseCode: "CASE_5",
        actionType: "CONTENT_DECAY",
        priorityScore: Math.round((prevImp - currImp) * 0.5 * 10) / 10,
        targetPath: pagePath,
        targetSlug: trackerEntry?.slug || pagePath,
        targetTitle: trackerEntry?.title || "",
        metrics: {
          previous14dImpressions: prevImp,
          recent14dImpressions: currImp,
          dropRatePercent: dropRate,
        },
        reason: `${pagePath} 페이지의 최근 14일 노출수가 직전 14일(${prevImp}회) 대비 ${currImp}회로 ${dropRate}% 감소함. Answer-First 요약문 및 2026년 최신 비교 데이터 갱신 필요.`,
      });
    }
  }

  // -------------------------------------------------------------------------
  // CASE_1: NEW_PSEO (GSC 유입 쿼리 중 전용 칼럼이 없는 키워드 발굴 — 토큰/의도 클러스터 중복 제외)
  // -------------------------------------------------------------------------
  for (const qRow of queryRows) {
    if (qRow.impressions < minImp) continue;
    const hasDedicatedPost = hasDedicatedPostForQuery(qRow.query, tracker.entries || []);

    if (!hasDedicatedPost) {
      candidateActions.push({
        caseCode: "CASE_1",
        actionType: "NEW_PSEO",
        priorityScore: Math.round(qRow.impressions * 0.85 * 10) / 10,
        targetPath: "/blog/[new-slug]",
        targetSlug: "new-pseo-candidate",
        triggerQuery: qRow.query,
        metrics: {
          impressions: qRow.impressions,
          clicks: qRow.clicks,
          position: qRow.position,
        },
        reason: `GSC에서 '${qRow.query}' 검색어로 ${qRow.impressions}회 노출(평균 ${qRow.position}위)이 발생하고 있으나, 이를 1:1로 정밀 타겟팅한 전용 pSEO 칼럼이 없음. 전용 글 발행 시 1페이지 진입 가능성 높음.`,
      });
    }
  }

  // -------------------------------------------------------------------------
  // CASE_6: INDEX_RESCUE (발행 후 14일 이상 경과했으나 GSC 노출 0회인 고립 칼럼 구출)
  // -------------------------------------------------------------------------
  const activeGscPaths = new Set(pageRows.map((p) => p.pagePath));
  const zeroImpressionEntries = [];
  for (const [pagePath, entry] of entryByPath.entries()) {
    if (entry.type === "tool") continue;
    if (isIgnoredPath(pagePath)) continue;
    if (entry.daysSinceMod >= 14 && !activeGscPaths.has(pagePath)) {
      zeroImpressionEntries.push(entry);
    }
  }

  // 플레이스 핵심 칼럼을 우선 구출 대상으로 정렬
  zeroImpressionEntries.sort((a, b) => {
    const aPlace = isPlaceRelated(a.pagePath, a.primaryKeyword, a) ? 1 : 0;
    const bPlace = isPlaceRelated(b.pagePath, b.primaryKeyword, b) ? 1 : 0;
    return bPlace - aPlace;
  });

  if (zeroImpressionEntries.length > 0) {
    const rescueTarget = zeroImpressionEntries[0];
    candidateActions.push({
      caseCode: "CASE_6",
      actionType: "INDEX_RESCUE",
      priorityScore: 12.0,
      targetPath: rescueTarget.pagePath,
      targetSlug: rescueTarget.slug,
      targetTitle: rescueTarget.title,
      triggerQuery: rescueTarget.primaryKeyword,
      metrics: {
        daysSincePublished: rescueTarget.daysSinceMod,
        gscImpressions90d: 0,
        totalUnindexedOrZeroImpPosts: zeroImpressionEntries.length,
      },
      reason: `'${rescueTarget.title}' 칼럼이 발행 후 ${rescueTarget.daysSinceMod}일이 경과했으나 최근 구글 노출이 0회임. 상위 유입 칼럼에서 내부 링크를 연결하고 타이틀 검색어 적합도를 개선해 색인 활성화 필요.`,
    });
  }

  // -------------------------------------------------------------------------
  // CASE_8: NAVER_LOW_CTR (네이버 서치어드바이저 노출 >= 100회 & CTR < 1.0% 저클릭 보강)
  // -------------------------------------------------------------------------
  const naverTopUrls = naverSnapshot?.topUrls || [];
  for (const nUrl of naverTopUrls) {
    const imp = Number(nUrl.impressions || 0);
    const ctr = Number(nUrl.ctr || 0);
    const clicks = Number(nUrl.clicks || 0);
    if (imp < 100 || ctr >= 1.0) continue;

    const pagePath = normalizePathFromUrl(nUrl.url || "");
    if (isIgnoredPath(pagePath)) continue;
    const trackerEntry = entryByPath.get(pagePath);
    if (trackerEntry && trackerEntry.isCooldownLocked) continue;

    candidateActions.push({
      caseCode: "CASE_8",
      actionType: "NAVER_LOW_CTR",
      priorityScore: Math.round(imp * 0.08 * 10) / 10,
      targetPath: pagePath,
      targetSlug: trackerEntry?.slug || pagePath,
      targetTitle: trackerEntry?.title || "",
      triggerQuery: `네이버:${pagePath}`,
      metrics: {
        naverImpressions: imp,
        naverClicks: clicks,
        naverCtr: ctr,
        naverPeriod: naverSnapshot?.period || null,
      },
      reason: `네이버 서치어드바이저에서 ${pagePath} 경로가 ${imp}회 노출되었으나 클릭 ${clicks}회(CTR ${ctr}%)에 그침. 네이버 스니펫용 타이틀 앞부분 핵심 키워드 전진 배치 및 메타 설명 클릭 훅 보강 필요.`,
    });
  }

  // 플레이스 핵심 우선순위 가중치 적용 (플레이스 관련 x2.0, 비플레이스 x0.4)
  for (const act of candidateActions) {
    const trackerEntry = entryByPath.get(act.targetPath);
    const placePriority = isPlaceRelated(act.targetPath, act.triggerQuery, trackerEntry);
    act.isPlacePriority = placePriority;
    act.basePriorityScore = act.priorityScore;
    act.priorityScore = Math.round(act.priorityScore * (placePriority ? 2.0 : 0.4) * 10) / 10;
  }

  // 우선순위 점수순 정렬
  candidateActions.sort((a, b) => b.priorityScore - a.priorityScore);

  const primaryAction =
    candidateActions.length > 0
      ? candidateActions[0]
      : {
          caseCode: "CASE_0",
          actionType: "NO_OP",
          priorityScore: 0,
          reason:
            "모든 핵심 타겟 페이지가 정상 범위 내에 있거나 14일 수정 잠금(Cooldown) 보호 기간 중이므로 오늘은 원고 수정/발행을 쉬어갑니다.",
        };

  const naverDiagnosisWarnings = naverSnapshot?.diagnosis?.seoWarningDetails || [];
  const naverSummary = naverSnapshot?.summary || null;

  const dailySnapshot = {
    date: todayStr,
    collectedAt: new Date().toISOString(),
    gscSummary: {
      totalQueriesTracked: queryRows.length,
      totalPagesWithImpressions: pageRows.length,
      topQueries: queryRows.slice(0, 15),
      topPages: pageRows.slice(0, 10),
      anomalies,
    },
    ga4Summary: {
      topPagesLast14d: Array.from(ga4PageMap.entries())
        .slice(0, 10)
        .map(([pathKey, stats]) => ({ path: pathKey, ...stats })),
    },
    naverSearchAdvisor: naverSnapshot,
    competitors: competitorReport,
    decision: {
      selectedAction: primaryAction,
      alternativeCandidates: candidateActions.slice(1, 6),
    },
  };

  fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
  const snapshotFile = path.resolve(SNAPSHOT_DIR, `${todayStr}.json`);
  fs.writeFileSync(snapshotFile, JSON.stringify(dailySnapshot, null, 2), "utf8");

  const pendingPayload = {
    actionId: `seo-${todayStr}-${primaryAction.caseCode.toLowerCase()}`,
    date: todayStr,
    createdAt: new Date().toISOString(),
    status: primaryAction.caseCode === "CASE_0" ? "NO_OP" : "PENDING_EXECUTION",
    selectedAction: primaryAction,
    alternativeCandidates: candidateActions.slice(1, 6),
    competitors: competitorReport,
    naverSummary,
    naverDiagnosisWarnings,
    gscTopQueries: queryRows.slice(0, 10),
  };

  fs.writeFileSync(PENDING_ACTION_PATH, JSON.stringify(pendingPayload, null, 2), "utf8");

  console.log("\n========================================================");
  console.log(`📊 [${todayStr}] PostSync A-to-Z SEO 판단 엔진 분석 완료`);
  console.log("========================================================");
  console.log(`▶ 오늘의 1순위 처방: [${primaryAction.caseCode}] ${primaryAction.actionType} (점수: ${primaryAction.priorityScore}${primaryAction.isPlacePriority ? " / 플레이스 핵심" : ""})`);
  console.log(`▶ 판정 사유: ${primaryAction.reason}`);
  if (primaryAction.targetPath) {
    console.log(`▶ 대상 경로: ${primaryAction.targetPath} (트리거 키워드: ${primaryAction.triggerQuery || "-"})`);
  }
  if (naverDiagnosisWarnings.length > 0) {
    console.log(
      `▶ 네이버 웹마스터 진단 경고 (${naverDiagnosisWarnings.length}건): ${naverDiagnosisWarnings
        .map((w) => `${w.issue || w.type}:${w.count}`)
        .join(", ")}`
    );
  }
  console.log("\n[차순위 후보 처방 Top 4]");
  for (const alt of candidateActions.slice(1, 5)) {
    console.log(
      `  - [${alt.caseCode}] ${alt.actionType} (${alt.priorityScore}점${alt.isPlacePriority ? ", 플레이스" : ""}): ${alt.triggerQuery || alt.targetPath} -> ${alt.reason.slice(0, 70)}...`
    );
  }
  console.log("\n[경쟁사 사이트맵 및 주간 발행 현황]");
  for (const c of Object.values(competitorReport)) {
    const relCount = Array.isArray(c.relevantNewUrls) ? c.relevantNewUrls.length : 0;
    console.log(
      `  - ${c.name} (${c.domain}): 총 ${c.totalUrls}개 URL | 최근 7일 갱신 ${c.weeklyActiveCount}개 | 전일 대비 신규 +${c.newlyAddedSinceLastCheck}개 (관련 신규 ${relCount}건)`
    );
  }
  console.log("========================================================\n");

  if (primaryAction.caseCode === "CASE_0" && notifyNoop) {
    const compLines = Object.values(competitorReport)
      .map((c) => `• ${c.name}: 총 <b>${c.totalUrls}개</b> (최근 7일 ${c.weeklyActiveCount}건 / 오늘 +${c.newlyAddedSinceLastCheck}건)`)
      .join("\n");

    const escHtml = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const naverWarnBlock =
      naverDiagnosisWarnings.length > 0
        ? `\n\n⚠️ <b>네이버 웹마스터 진단 경고:</b>\n${naverDiagnosisWarnings
            .map((w) => `• ${escHtml(w.issue || w.type)}: <b>${w.count}건</b>`)
            .join("\n")}`
        : "";

    const noopMsg = `🟢 <b>[PostSync SEO 판단 엔진] ${todayStr} 관망(No-Op) 판정</b>

오늘 오전 서치콘솔·GA4·네이버·경쟁사 사이트맵 정밀 점검 결과, 인위적인 원고 수정이나 추가 발행 없이 현 상태를 유지하는 것이 유리하다고 판단되었습니다.

📌 <b>판정 사유:</b>
${primaryAction.reason}

🔭 <b>경쟁사 사이트맵 감시 현황:</b>
${compLines}${naverWarnBlock}`;

    await sendTelegramPlain(noopMsg);
  }
}

main().catch((err) => {
  console.error("[SEO Decision Engine Error]:", err);
  process.exit(1);
});
