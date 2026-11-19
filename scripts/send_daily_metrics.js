const path = require("path");
const {
  initRuntime,
  createGoogleAuth,
  escapeHtml,
  getKstYmd,
  getKstYesterdayLabel,
  sendTelegramMessage,
} = require("./lib/common");

const ROOT_DIR = path.resolve(__dirname, "..");
initRuntime(ROOT_DIR);

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  if (mins === 0) return `${secs}초`;
  return `${mins}분 ${secs}초`;
}

function calculateChange(current, previous) {
  if (previous === 0) return current > 0 ? "+100%" : "0%";
  const diff = current - previous;
  const rate = Math.round((diff / previous) * 1000) / 10;
  return rate >= 0 ? `+${rate}%` : `${rate}%`;
}

async function run() {
  const { google } = require("googleapis");
  const propertyId = process.env.GA4_PROPERTY_ID || "546100897";
  const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || "https://www.postsyncapp.com/";

  const auth = createGoogleAuth(google, ROOT_DIR);
  const authClient = await auth.getClient();
  const analyticsdata = google.analyticsdata({ version: "v1beta", auth: authClient });
  const searchconsole = google.searchconsole({ version: "v1", auth: authClient });

  console.log("Fetching GA4 metrics...");
  const ga4Res = await analyticsdata.properties.runReport({
    property: `properties/${propertyId}`,
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

  console.log("Fetching Traffic sources...");
  const trafficRes = await analyticsdata.properties.runReport({
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [{ startDate: "yesterday", endDate: "yesterday" }],
      dimensions: [{ name: "sessionSourceMedium" }],
      metrics: [{ name: "sessions" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: "4",
    },
  });

  const trafficSources = (trafficRes.data.rows || []).map((row) => ({
    source: row.dimensionValues?.[0]?.value || "(알 수 없음)",
    sessions: parseInt(row.metricValues?.[0]?.value || "0", 10),
  }));

  console.log("Fetching Top pages...");
  const pagesRes = await analyticsdata.properties.runReport({
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [{ startDate: "yesterday", endDate: "yesterday" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }, { name: "averageSessionDuration" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: "3",
    },
  });

  const topPages = (pagesRes.data.rows || []).map((row) => ({
    path: row.dimensionValues?.[0]?.value || "/",
    views: parseInt(row.metricValues?.[0]?.value || "0", 10),
    duration: Math.round(parseFloat(row.metricValues?.[1]?.value || "0")),
  }));

  console.log("Fetching Search Console top queries...");
  let searchSummary = "• 최근 집계 대기 중";
  try {
    const startDate = getKstYmd(-10);
    const endDate = getKstYmd(-1);

    // GSC는 클릭 0건 구간을 알파벳순으로 반환하므로 충분히 조회한 뒤 노출 내림차순 정렬
    const scRes = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ["query"],
        dataState: "all",
        rowLimit: 100,
      },
    });

    const rows = (scRes.data.rows || [])
      .slice()
      .sort((a, b) => (b.impressions || 0) - (a.impressions || 0) || (b.clicks || 0) - (a.clicks || 0))
      .slice(0, 4);

    if (rows.length > 0) {
      searchSummary = rows
        .map(
          (r) =>
            `• <code>${escapeHtml(r.keys?.[0] || "")}</code> (${r.impressions || 0}회 노출, 평균 ${Math.round(r.position || 0)}위)`
        )
        .join("\n");
    }
  } catch (err) {
    console.warn("Search Console error:", err.message);
  }

  const dateStr = getKstYesterdayLabel();
  const newUserRate = yUsers > 0 ? Math.round((yNewUsers / yUsers) * 100) : 0;
  const bounceChange = Math.round((yBounce - bBounce) * 10) / 10;
  const bounceChangeStr = bounceChange <= 0 ? `${bounceChange}%p 개선` : `+${bounceChange}%p`;

  const trafficLines = trafficSources
    .map((t) => `• ${escapeHtml(t.source)}: <b>${t.sessions}회</b>`)
    .join("\n");

  const pageLines = topPages
    .map((p) => `• <b>${escapeHtml(p.path)}</b>: ${p.views}회 (${formatDuration(p.duration)})`)
    .join("\n");

  const reportText = `📊 <b>[PostSync] ${dateStr} 일일 실적 브리핑</b>

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

  console.log("Sending Telegram message...");
  const messageId = await sendTelegramMessage(reportText);
  console.log("Successfully sent! Message ID:", messageId);
}

run().catch((err) => {
  console.error("Execution failed:", err);
  process.exit(1);
});
