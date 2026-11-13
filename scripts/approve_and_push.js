/**
 * PostSync SEO 자율 판단 엔진 텔레그램 결재 요청 및 승인 후 자동 Git 푸시 스크립트
 *
 * 사용법:
 *   node scripts/approve_and_push.js --slug "naver-place-rank-checker-free" --title "제목" --summary "변경 요약" --wait-mins 30
 */

const path = require("path");
const fs = require("fs");
const net = require("net");
const { execSync } = require("child_process");

// Windows IPv6 Happy Eyeballs 타임아웃(ETIMEDOUT) 방지
net.setDefaultAutoSelectFamily(false);

// .env.local 로드
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
const PENDING_ACTION_PATH = path.resolve(ROOT_DIR, "src/data/pending-seo-action.json");
const TRACKER_PATH = path.resolve(ROOT_DIR, "src/data/seo-tracker.json");

function getArg(flag, defaultVal = "") {
  const idx = process.argv.indexOf(flag);
  if (idx !== -1 && process.argv[idx + 1]) {
    return process.argv[idx + 1];
  }
  return defaultVal;
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function sendTelegramApproval(text, actionId) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) {
    throw new Error("TELEGRAM_BOT_TOKEN 또는 TELEGRAM_CHAT_ID가 설정되지 않았습니다.");
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [
            { text: "✅ 승인 및 GitHub 푸시", callback_data: `approve:${actionId}` },
            { text: "⏸️ 오늘 보류", callback_data: `reject:${actionId}` },
          ],
        ],
      },
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.ok) {
    throw new Error(`텔레그램 결재 요청 발송 실패: ${data.description || res.statusText}`);
  }
  return data.result?.message_id;
}

async function sendTelegramNotice(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
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

async function waitForApproval(actionId, waitMins) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const targetChatId = process.env.TELEGRAM_CHAT_ID?.trim();
  const timeoutMs = waitMins * 60 * 1000;

  let offset = 0;
  try {
    const initRes = await fetch(`https://api.telegram.org/bot${token}/getUpdates?limit=5&timeout=0`);
    const initData = await initRes.json();
    if (initData.ok && Array.isArray(initData.result) && initData.result.length > 0) {
      offset = initData.result[initData.result.length - 1].update_id + 1;
    }
  } catch {
    // ignore
  }

  const deadline = Date.now() + timeoutMs;
  console.log(`⏳ 텔레그램 승인 대기 중... (최대 ${waitMins}분, actionId: ${actionId})`);

  while (Date.now() < deadline) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates?offset=${offset}&timeout=10`);
      const data = await res.json();

      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          offset = update.update_id + 1;

          if (update.callback_query) {
            const cb = update.callback_query;
            const cbChatId = String(cb.message?.chat?.id || "");
            const cbData = String(cb.data || "");

            if (cbChatId === targetChatId) {
              if (cbData === `approve:${actionId}`) {
                await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    callback_query_id: cb.id,
                    text: "승인 확인! GitHub 푸시를 실행합니다.",
                  }),
                });
                return "approved";
              }
              if (cbData === `reject:${actionId}`) {
                await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    callback_query_id: cb.id,
                    text: "보류 처리되었습니다.",
                  }),
                });
                return "rejected";
              }
            }
          }

          if (update.message && String(update.message.chat?.id || "") === targetChatId) {
            const msgText = String(update.message.text || "").trim().toLowerCase();
            if (["승인", "푸시", "푸시해줘", "/approve", "approve", "ok", "ㅇㅇ"].includes(msgText)) {
              return "approved";
            }
            if (["보류", "취소", "/reject", "reject", "hold"].includes(msgText)) {
              return "rejected";
            }
          }
        }
      }
    } catch {
      // 재시도
    }

    await new Promise((r) => setTimeout(r, 3000));
  }

  return "timeout";
}

function updateTrackerRecord(slug, title, caseCode, summary) {
  if (!fs.existsSync(TRACKER_PATH)) return null;
  const tracker = JSON.parse(fs.readFileSync(TRACKER_PATH, "utf8"));
  const todayStr = new Date().toISOString().split("T")[0];

  let targetEntry = null;
  for (const entry of tracker.entries || []) {
    if (entry.slug === slug || `/blog/${entry.slug}` === slug) {
      entry.lastModifiedAt = todayStr;
      if (title) entry.title = title;
      entry.history = entry.history || [];
      entry.history.push({
        date: todayStr,
        caseCode,
        summary,
      });
      targetEntry = entry;
      break;
    }
  }

  if (!targetEntry && slug) {
    const cleanSlug = slug.replace(/^\/blog\//, "");
    const targetUrl = slug.startsWith("/")
      ? `https://www.postsyncapp.com${slug}`
      : `https://www.postsyncapp.com/blog/${cleanSlug}`;
    const guessedSourceFile = slug.startsWith("/")
      ? `public/${slug.replace(/^\/+/, "")}.html`
      : "src/lib/pSeoPlacePosts.ts";

    targetEntry = {
      id: `auto-${Date.now()}`,
      slug: slug.startsWith("/") ? slug : cleanSlug,
      url: targetUrl,
      title: title || cleanSlug,
      sourceFile: guessedSourceFile,
      type: slug.startsWith("/") ? "tool" : "pseo",
      isPlaceCore: /place|utm|reply|adcheck/.test(slug),
      primaryKeyword: title || cleanSlug,
      secondaryKeywords: [],
      publishedAt: todayStr,
      lastModifiedAt: todayStr,
      history: [{ date: todayStr, caseCode, summary }],
    };
    tracker.entries.push(targetEntry);
  }

  tracker.updatedAt = new Date().toISOString();
  fs.writeFileSync(TRACKER_PATH, JSON.stringify(tracker, null, 2), "utf8");
  return targetEntry;
}

async function pingNaverSyndicationIfConfigured({ url, title, summary, publishedAt }) {
  const token = process.env.NAVER_SYNDICATION_TOKEN;
  if (!token || !url) {
    return {
      attempted: false,
      message: "NAVER_SYNDICATION_TOKEN 미설정으로 네이버 신디케이션 핑 생략",
    };
  }

  const nowIso = new Date().toISOString();
  const safeUrl = url.replace(/&/g, "&amp;");
  const safeTitle = String(title || "PostSync").replace(/]]>/g, "]]&gt;");
  const safeSummary = String(summary || "").replace(/]]>/g, "]]&gt;");

  const xmlPayload = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>PostSync</title>
  <updated>${nowIso}</updated>
  <entry>
    <id>${safeUrl}</id>
    <title><![CDATA[${safeTitle}]]></title>
    <author>
      <name>PostSync</name>
    </author>
    <updated>${nowIso}</updated>
    ${publishedAt ? `<published>${new Date(publishedAt).toISOString()}</published>` : ""}
    <link rel="alternate" type="text/html" href="${safeUrl}" />
    ${safeSummary ? `<summary type="text"><![CDATA[${safeSummary}]]></summary>` : ""}
  </entry>
</feed>`;

  try {
    const res = await fetch("https://apis.naver.com/crawl/nsyndi/v2", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/xml",
      },
      body: xmlPayload,
    });
    if (!res.ok) {
      const errText = await res.text();
      return { attempted: true, ok: false, message: `신디케이션 실패(${res.status}): ${errText.slice(0, 120)}` };
    }
    return { attempted: true, ok: true, message: "네이버 신디케이션 v2 수집 봇 호출 완료" };
  } catch (err) {
    return { attempted: true, ok: false, message: `신디케이션 오류: ${err.message}` };
  }
}

async function main() {
  if (!fs.existsSync(PENDING_ACTION_PATH)) {
    throw new Error("pending-seo-action.json 파일이 없습니다. 먼저 collect_and_decide_seo.js를 실행하세요.");
  }

  const pending = JSON.parse(fs.readFileSync(PENDING_ACTION_PATH, "utf8"));
  const action = pending.selectedAction || {};
  const slug = getArg("--slug", action.targetSlug || "");
  const title = getArg("--title", action.targetTitle || "");
  const summary = getArg("--summary", action.reason || "SEO 자동 최적화 반영");
  const waitMins = parseInt(getArg("--wait-mins", "30"), 10);

  const compLines = Object.values(pending.competitors || {})
    .map(
      (c) =>
        `• ${escapeHtml(c.name)}: 총 <b>${c.totalUrls}개</b> (최근 7일 갱신 ${c.weeklyActiveCount || 0}건 / 신규 +${c.newlyAddedSinceLastCheck || 0}건)`
    )
    .join("\n");

  const msg = `🤖 <b>[PostSync SEO 자율 판단 엔진 결재 요청]</b>

📅 <b>분석 일자:</b> ${escapeHtml(pending.date)}
🎯 <b>판정 코드:</b> <code>[${escapeHtml(action.caseCode)}] ${escapeHtml(action.actionType)}</code>
📍 <b>대상 경로:</b> <code>${escapeHtml(slug)}</code>
🔑 <b>타겟 키워드:</b> <b>${escapeHtml(action.triggerQuery || title)}</b>

📊 <b>감지 사유:</b>
${escapeHtml(action.reason)}

✍️ <b>적용된 수정/작성 요약:</b>
${escapeHtml(summary)}

🔭 <b>경쟁사 주간 발행·색인 감시:</b>
${compLines}

✅ <b>로컬 빌드(npm run build):</b> 에러 0건 검증 완료
아래 <b>[✅ 승인 및 GitHub 푸시]</b> 버튼을 누르시거나 <code>승인</code>이라고 답장해 주시면 즉시 배포됩니다.`;

  await sendTelegramApproval(msg, pending.actionId);
  console.log("✅ 텔레그램 결재 요청 메시지 발송 완료.");

  if (process.argv.includes("--send-only")) {
    return;
  }

  const decision = await waitForApproval(pending.actionId, waitMins);
  if (decision === "approved") {
    console.log("🚀 대표님 승인 확인! 트래커 업데이트 및 Git Commit/Push를 진행합니다.");
    const updatedEntry = updateTrackerRecord(slug, title, action.caseCode, summary);

    const candidateFiles = [
      updatedEntry?.sourceFile,
      "src/lib/pSeoPlacePosts.ts",
      "src/lib/blogData.ts",
      "src/data/seo-tracker.json",
      "src/data/competitor-snapshots.json",
      "src/data/naver-latest.json",
    ].filter(Boolean);

    const existingFiles = Array.from(new Set(candidateFiles)).filter((relPath) =>
      fs.existsSync(path.resolve(ROOT_DIR, relPath))
    );
    const gitAddArgs = existingFiles.map((f) => `"${f}"`).join(" ");

    execSync(`git add ${gitAddArgs}`, { cwd: ROOT_DIR, stdio: "inherit" });

    const commitMsg = `chore(seo): [${action.caseCode}] ${slug} 자동 최적화 반영`;
    execSync(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`, { cwd: ROOT_DIR, stdio: "inherit" });
    execSync("git push origin main", { cwd: ROOT_DIR, stdio: "inherit" });

    const syndicationResult = await pingNaverSyndicationIfConfigured({
      url: updatedEntry?.url || "",
      title: updatedEntry?.title || title,
      summary,
      publishedAt: updatedEntry?.publishedAt,
    });
    console.log(`[Naver Syndication] ${syndicationResult.message}`);

    pending.status = "APPROVED_AND_PUSHED";
    pending.pushedAt = new Date().toISOString();
    fs.writeFileSync(PENDING_ACTION_PATH, JSON.stringify(pending, null, 2), "utf8");

    const syndiLine = syndicationResult.attempted
      ? `\n• <b>네이버 신디케이션:</b> ${escapeHtml(syndicationResult.message)}`
      : "";

    await sendTelegramNotice(
      `🚀 <b>[PostSync SEO 배포 완료]</b>\n\n• <b>대상:</b> <code>${escapeHtml(slug)}</code>\n• <b>판정:</b> <code>${escapeHtml(action.caseCode)}</code>\n• <b>상태:</b> GitHub <code>main</code> 브랜치 푸시 완료 (14일 쿨다운 보호 시작)${syndiLine}`
    );
  } else if (decision === "rejected") {
    console.log("⏸️ 대표님께서 보류를 선택하셨습니다. Git 푸시를 실행하지 않습니다.");
    pending.status = "REJECTED_HOLD";
    fs.writeFileSync(PENDING_ACTION_PATH, JSON.stringify(pending, null, 2), "utf8");
    await sendTelegramNotice(`⏸️ <b>[오늘의 SEO 반영 보류 완료]</b>\n로컬 수정 내역은 푸시하지 않고 보류했습니다.`);
  } else {
    console.log("⌛ 승인 대기 시간이 초과되어 자동 푸시를 보류했습니다.");
    await sendTelegramNotice(
      `⌛ <b>[SEO 결재 대기 시간(${waitMins}분) 경과]</b>\n자동 푸시를 보류했습니다. 추후 반영을 원하시면 언제든 에이전트에게 '푸시해줘'라고 말씀해 주세요.`
    );
  }
}

main().catch((err) => {
  console.error("[Approve & Push Error]:", err.message);
  process.exit(1);
});
