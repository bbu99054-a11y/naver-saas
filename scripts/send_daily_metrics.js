const path = require("path");
const fs = require("fs");
const net = require("net");

// Windows IPv6 Happy Eyeballs 타임아웃(ETIMEDOUT) 방지
net.setDefaultAutoSelectFamily(false);

// .env.local 수동 파싱 및 환경변수 주입
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

// 텔레그램 메시지 발송 함수 (바닐라 REST fetch)
async function sendTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("TELEGRAM_BOT_TOKEN 또는 TELEGRAM_CHAT_ID가 설정되지 않았습니다.");
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.ok) {
    throw new Error(`텔레그램 발송 실패: ${data.description || res.statusText}`);
  }
  return data;
}

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
  const keyPath = path.resolve(__dirname, "../postsync-api-9be9a8c8fa03.json");
  const propertyId = process.env.GA4_PROPERTY_ID || "546100897";
  const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || "https://www.postsyncapp.com/";

  const auth = new google.auth.GoogleAuth({
    keyFile: keyPath,
    scopes: [
      "https://www.googleapis.com/auth/webmasters.readonly",
      "https://www.googleapis.com/auth/analytics.readonly",
    ],
  });

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
      limit: 4,
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
      limit: 3,
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
    const todayObj = new Date();
    const tenDaysAgoObj = new Date(todayObj.getTime() - 10 * 24 * 60 * 60 * 1000);
    const startDate = tenDaysAgoObj.toISOString().split("T")[0];
    const endDate = todayObj.toISOString().split("T")[0];

    const scRes = await searchconsole.searchanalytics.query({
      siteUrl,
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
        .map((r) => `• <code>${r.keys[0]}</code> (${r.impressions}회 노출, 평균 ${Math.round(r.position)}위)`)
        .join("\n");
    }
  } catch (err) {
    console.warn("Search Console error:", err.message);
  }

  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const dateStr = `${yesterday.getMonth() + 1}월 ${yesterday.getDate()}일`;

  const newUserRate = yUsers > 0 ? Math.round((yNewUsers / yUsers) * 100) : 0;
  const bounceChange = Math.round((yBounce - bBounce) * 10) / 10;
  const bounceChangeStr = bounceChange <= 0 ? `${bounceChange}%p 개선` : `+${bounceChange}%p`;

  const trafficLines = trafficSources
    .map((t) => `• ${t.source}: <b>${t.sessions}회</b>`)
    .join("\n");

  const pageLines = topPages
    .map((p) => `• <b>${p.path}</b>: ${p.views}회 (${formatDuration(p.duration)})`)
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
  const result = await sendTelegram(reportText);
  console.log("Successfully sent! Message ID:", result.result?.message_id);
}

run().catch((err) => {
  console.error("Execution failed:", err);
  process.exit(1);
});
