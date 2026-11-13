import { google } from "googleapis";
import { getGoogleAuthClient } from "../google/auth";
import { sendTelegramMessage } from "./bot";

const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || "546100897";
const SITE_URL = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || "https://www.postsyncapp.com/";

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  if (mins === 0) return `${secs}초`;
  return `${mins}분 ${secs}초`;
}

function calculateChange(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? "+100%" : "0%";
  const diff = current - previous;
  const rate = Math.round((diff / previous) * 1000) / 10;
  return rate >= 0 ? `+${rate}%` : `${rate}%`;
}

export async function generateDailyMetricsReport(): Promise<string> {
  const authClient = await getGoogleAuthClient();
  const analyticsdata = google.analyticsdata({ version: "v1beta", auth: authClient as any });
  const searchconsole = google.searchconsole({ version: "v1", auth: authClient as any });

  // 1. GA4 어제 vs 그저께 지표 조회
  const ga4Res = await analyticsdata.properties.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    requestBody: {
      dateRanges: [
        { startDate: "yesterday", endDate: "yesterday", name: "yesterday" },
        { startDate: "2daysAgo", endDate: "2daysAgo", name: "dayBefore" },
      ],
      metrics: [
        { name: "activeUsers" },
        { name: "newUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "averageSessionDuration" },
        { name: "bounceRate" },
      ],
    },
  });

  const yesterdayRow = ga4Res.data.rows?.find((r) => r.dimensionValues?.[0]?.value === "yesterday")?.metricValues || [];
  const dayBeforeRow = ga4Res.data.rows?.find((r) => r.dimensionValues?.[0]?.value === "dayBefore")?.metricValues || [];

  const yUsers = parseInt(yesterdayRow[0]?.value || "0", 10);
  const bUsers = parseInt(dayBeforeRow[0]?.value || "0", 10);
  const yNewUsers = parseInt(yesterdayRow[1]?.value || "0", 10);
  const ySessions = parseInt(yesterdayRow[2]?.value || "0", 10);
  const bSessions = parseInt(dayBeforeRow[2]?.value || "0", 10);
  const yViews = parseInt(yesterdayRow[3]?.value || "0", 10);
  const bViews = parseInt(dayBeforeRow[3]?.value || "0", 10);
  const yDuration = parseFloat(yesterdayRow[4]?.value || "0");
  const bDuration = parseFloat(dayBeforeRow[4]?.value || "0");
  const yBounce = Math.round(parseFloat(yesterdayRow[5]?.value || "0") * 1000) / 10;
  const bBounce = Math.round(parseFloat(dayBeforeRow[5]?.value || "0") * 1000) / 10;

  // 2. GA4 유입 소스 조회
  const trafficRes: any = await analyticsdata.properties.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    requestBody: {
      dateRanges: [{ startDate: "yesterday", endDate: "yesterday" }],
      dimensions: [{ name: "sessionSourceMedium" }],
      metrics: [{ name: "sessions" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: "5",
    },
  });

  const trafficSources: Array<{ source: string; sessions: number }> = (
    (trafficRes.data?.rows || []) as any[]
  ).map((row) => ({
    source: (row.dimensionValues?.[0]?.value || "(알 수 없음)") as string,
    sessions: parseInt(row.metricValues?.[0]?.value || "0", 10),
  }));

  // 3. GA4 페이지별 실적 (/place 점유율)
  const pagesRes: any = await analyticsdata.properties.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    requestBody: {
      dateRanges: [{ startDate: "yesterday", endDate: "yesterday" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }, { name: "averageSessionDuration" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: "3",
    },
  });

  const topPages: Array<{ path: string; views: number; duration: number }> = (
    (pagesRes.data?.rows || []) as any[]
  ).map((row) => ({
    path: (row.dimensionValues?.[0]?.value || "/") as string,
    views: parseInt(row.metricValues?.[0]?.value || "0", 10),
    duration: Math.round(parseFloat(row.metricValues?.[1]?.value || "0")),
  }));

  // 4. 서치콘솔 최근 키워드
  let searchSummary = "집계 대기 중";
  try {
    const todayObj = new Date();
    const tenDaysAgoObj = new Date(todayObj.getTime() - 10 * 24 * 60 * 60 * 1000);
    const startDate = tenDaysAgoObj.toISOString().split("T")[0];
    const endDate = todayObj.toISOString().split("T")[0];

    const scRes = await searchconsole.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate,
        endDate,
        dimensions: ["query"],
        rowLimit: 4,
      },
    });

    const rows = scRes.data.rows || [];
    if (rows.length > 0) {
      searchSummary = rows
        .map((r) => `• <code>${r.keys?.[0]}</code> (${r.impressions}회 노출, 평균 ${Math.round(r.position || 0)}위)`)
        .join("\n");
    }
  } catch {
    searchSummary = "데이터 집계 중";
  }

  // 어제 날짜 구하기 (KST 기준)
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const dateStr = `${yesterday.getMonth() + 1}월 ${yesterday.getDate()}일`;

  // HTML 리포트 조합
  const newUserRate = yUsers > 0 ? Math.round((yNewUsers / yUsers) * 100) : 0;
  const bounceChange = Math.round((yBounce - bBounce) * 10) / 10;
  const bounceChangeStr = bounceChange <= 0 ? `${bounceChange}%p 개선` : `+${bounceChange}%p`;

  const trafficLines = trafficSources
    .map((t) => `• ${t.source.replace(" / ", " / ")}: <b>${t.sessions}회</b>`)
    .join("\n");

  const pageLines = topPages
    .map((p) => `• <b>${p.path}</b>: ${p.views}회 (${formatDuration(p.duration)})`)
    .join("\n");

  return `📊 <b>[PostSync] ${dateStr} 일일 실적 브리핑</b>

👥 <b>방문자:</b> <b>${yUsers}명</b> (${calculateChange(yUsers, bUsers)})
  - 신규 방문: <b>${yNewUsers}명</b> (${newUserRate}%)
📈 <b>세션:</b> <b>${ySessions}회</b> (${calculateChange(ySessions, bSessions)})
👀 <b>페이지뷰:</b> <b>${yViews}회</b> (${calculateChange(yViews, bViews)})
⏱️ <b>평균 체류:</b> <b>${formatDuration(yDuration)}</b> (전일: ${formatDuration(bDuration)})
📉 <b>이탈률:</b> <b>${yBounce}%</b> (${bounceChangeStr})

🔥 <b>가장 많이 본 페이지 TOP 3</b>
${pageLines || "• 데이터 없음"}

🔍 <b>주요 유입 채널</b>
${trafficLines || "• 데이터 없음"}

🎯 <b>구글 서치콘솔 주요 노출 검색어</b>
${searchSummary}

🔗 <a href="https://www.postsyncapp.com">PostSync 바로가기</a>`;
}

export async function sendDailyMetricsReport() {
  try {
    const reportText = await generateDailyMetricsReport();
    return await sendTelegramMessage(reportText, { parseMode: "HTML" });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("[Daily Metrics Report Error]:", errMsg);
    return { success: false, error: errMsg };
  }
}
