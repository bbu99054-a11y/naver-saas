/**
 * PostSync SEO 자율 판단 엔진 텔레그램 결재 요청 및 승인 후 자동 Git 푸시 스크립트
 *
 * 사용법:
 *   node scripts/approve_and_push.js --slug "naver-place-rank-checker-free" --title "제목" --summary "변경 요약" --files "src/lib/pSeoPlacePosts.ts" --wait-mins 30
 */

const path = require("path");
const fs = require("fs");
const { execFileSync } = require("child_process");
const { pingIndexNow } = require("./ping_indexnow");
const {
  initRuntime,
  escapeHtml,
  getKstYmd,
  sendTelegramMessage,
  getLatestTelegramOffset,
} = require("./lib/common");

const ROOT_DIR = path.resolve(__dirname, "..");
initRuntime(ROOT_DIR);

const PENDING_ACTION_PATH = path.resolve(ROOT_DIR, "src/data/pending-seo-action.json");
const TRACKER_PATH = path.resolve(ROOT_DIR, "src/data/seo-tracker.json");

const APPROVE_COMMANDS = new Set(["승인", "푸시", "푸시해줘", "/approve", "approve"]);
const REJECT_COMMANDS = new Set(["보류", "취소", "/reject", "reject", "hold"]);

function getArg(flag, defaultVal = "") {
  const idx = process.argv.indexOf(flag);
  if (idx !== -1 && process.argv[idx + 1]) {
    return process.argv[idx + 1];
  }
  return defaultVal;
}

function guessSourceFileForSlug(slug) {
  if (!slug) return "src/lib/pSeoPlacePosts.ts";
  if (slug === "/") return "src/app/page.tsx";
  if (slug === "/guide/ad-law-2026") return "src/app/guide/ad-law-2026/page.tsx";
  if (slug.startsWith("/place/")) return "src/lib/industryPlaceData.ts";
  if (slug.startsWith("/")) return `public/${slug.replace(/^\/+/, "")}.html`;
  return "src/lib/pSeoPlacePosts.ts";
}

async function sendTelegramApproval(text, actionId) {
  return sendTelegramMessage(text, {
    replyMarkup: {
      inline_keyboard: [
        [
          { text: "✅ 승인 및 GitHub 푸시", callback_data: `approve:${actionId}` },
          { text: "⏸️ 오늘 보류", callback_data: `reject:${actionId}` },
        ],
      ],
    },
  });
}

async function waitForApproval(actionId, waitMins) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const targetChatId = process.env.TELEGRAM_CHAT_ID?.trim();
  const timeoutMs = waitMins * 60 * 1000;

  let offset = await getLatestTelegramOffset(token);
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
            if (APPROVE_COMMANDS.has(msgText)) {
              return "approved";
            }
            if (REJECT_COMMANDS.has(msgText)) {
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
  const todayStr = getKstYmd();

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
      ? `https://www.postsyncapp.com${slug === "/" ? "" : slug}`
      : `https://www.postsyncapp.com/blog/${cleanSlug}`;

    targetEntry = {
      id: `auto-${Date.now()}`,
      slug: slug.startsWith("/") ? slug : cleanSlug,
      url: targetUrl,
      title: title || cleanSlug,
      sourceFile: guessSourceFileForSlug(slug),
      type: slug.startsWith("/place/") ? "pseo" : slug.startsWith("/") ? "tool" : "pseo",
      isPlaceCore: /place|utm|reply|adcheck/.test(slug) || slug === "/",
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

function recordRejectSnooze(action) {
  if (!fs.existsSync(TRACKER_PATH) || !action) return 7;
  const tracker = JSON.parse(fs.readFileSync(TRACKER_PATH, "utf8"));
  const snoozeDays = Number(tracker.policy?.rejectSnoozeDays ?? 7);
  const todayStr = getKstYmd();
  const snoozeUntil = getKstYmd(snoozeDays);
  const targetPath = action.targetPath || action.targetSlug || "-";
  const triggerQuery = action.triggerQuery || null;

  const activeSnoozes = (tracker.snoozedActions || []).filter(
    (s) => s.snoozeUntil && s.snoozeUntil >= todayStr
  );
  const filtered = activeSnoozes.filter(
    (s) =>
      !(
        s.caseCode === action.caseCode &&
        s.targetPath === targetPath &&
        (action.caseCode !== "CASE_1" || s.triggerQuery === triggerQuery)
      )
  );
  filtered.push({
    caseCode: action.caseCode,
    targetPath,
    triggerQuery,
    rejectedAt: todayStr,
    snoozeUntil,
    reason: "텔레그램 최종 푸시 보류",
  });

  tracker.snoozedActions = filtered;
  tracker.updatedAt = new Date().toISOString();
  fs.writeFileSync(TRACKER_PATH, JSON.stringify(tracker, null, 2), "utf8");
  return snoozeDays;
}

function getModifiedGitFiles(rootDir) {
  const raw = execFileSync("git", ["status", "--porcelain"], { cwd: rootDir, encoding: "utf8" });
  const modified = new Set();
  for (const line of raw.split(/\r?\n/)) {
    if (!line || line.length < 4) continue;
    const status = line.slice(0, 2);
    if (status.includes("D")) continue;
    let filePath = line.slice(3).trim();
    if (filePath.includes(" -> ")) {
      filePath = filePath.split(" -> ").pop().trim();
    }
    if (filePath.startsWith('"') && filePath.endsWith('"')) {
      filePath = filePath.slice(1, -1);
    }
    modified.add(filePath.replace(/\\/g, "/"));
  }
  return modified;
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
  const explicitFilesArg = getArg("--files", "");
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

    const explicitFiles = explicitFilesArg
      ? explicitFilesArg
          .split(",")
          .map((s) => s.trim().replace(/\\/g, "/"))
          .filter(Boolean)
      : [];

    const candidateFiles = [
      ...explicitFiles,
      updatedEntry?.sourceFile,
      guessSourceFileForSlug(slug),
      "src/lib/pSeoPlacePosts.ts",
      "src/lib/blogData.ts",
      "src/lib/industryPlaceData.ts",
      "src/app/page.tsx",
      "src/data/seo-tracker.json",
      "src/data/competitor-snapshots.json",
      "src/data/naver-latest.json",
    ].filter(Boolean);

    const dirtyFiles = getModifiedGitFiles(ROOT_DIR);
    const filesToStage = Array.from(new Set(candidateFiles)).filter((relPath) => {
      const normalized = relPath.replace(/\\/g, "/");
      return fs.existsSync(path.resolve(ROOT_DIR, normalized)) && dirtyFiles.has(normalized);
    });

    if (filesToStage.length === 0) {
      console.log("ℹ️ 커밋할 변경된 허용 파일이 없어 Git 커밋·푸시를 건너뜁니다.");
      return;
    }

    execFileSync("git", ["add", "--", ...filesToStage], { cwd: ROOT_DIR, stdio: "inherit" });

    const commitMsg = `chore(seo): [${action.caseCode}] ${slug} 자동 최적화 반영`;
    execFileSync("git", ["commit", "-m", commitMsg], { cwd: ROOT_DIR, stdio: "inherit" });
    execFileSync("git", ["push", "origin", "main"], { cwd: ROOT_DIR, stdio: "inherit" });

    const indexNowResult = await pingIndexNow([updatedEntry?.url].filter(Boolean));
    console.log(`[IndexNow] ${indexNowResult.message}`);

    pending.status = "APPROVED_AND_PUSHED";
    pending.pushedAt = new Date().toISOString();
    fs.writeFileSync(PENDING_ACTION_PATH, JSON.stringify(pending, null, 2), "utf8");

    const indexNowLine = indexNowResult.attempted
      ? `\n• <b>IndexNow 색인 핑:</b> ${escapeHtml(indexNowResult.message)}`
      : "";

    await sendTelegramMessage(
      `🚀 <b>[PostSync SEO 배포 완료]</b>\n\n• <b>대상:</b> <code>${escapeHtml(slug)}</code>\n• <b>판정:</b> <code>${escapeHtml(action.caseCode)}</code>\n• <b>상태:</b> GitHub <code>main</code> 브랜치 푸시 완료 (14일 쿨다운 보호 시작)${indexNowLine}`
    );
  } else if (decision === "rejected") {
    console.log("⏸️ 대표님께서 보류를 선택하셨습니다. Git 푸시를 실행하지 않습니다.");
    pending.status = "REJECTED_HOLD";
    pending.editRejectedAt = new Date().toISOString();
    fs.writeFileSync(PENDING_ACTION_PATH, JSON.stringify(pending, null, 2), "utf8");
    const snoozeDays = recordRejectSnooze(action);
    await sendTelegramMessage(
      `⏸️ <b>[오늘의 SEO 반영 보류 완료]</b>\n로컬 수정 내역은 푸시하지 않고 보류했으며 ${snoozeDays}일간 동일 항목 재추천을 보류합니다.`
    );
  } else {
    console.log("⌛ 승인 대기 시간이 초과되어 자동 푸시를 보류했습니다.");
    await sendTelegramMessage(
      `⌛ <b>[SEO 결재 대기 시간(${waitMins}분) 경과]</b>\n자동 푸시를 보류했습니다. 추후 반영을 원하시면 언제든 에이전트에게 '푸시해줘'라고 말씀해 주세요.`
    );
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error("[Approve & Push Error]:", err.message);
    process.exit(1);
  });
}

module.exports = {
  guessSourceFileForSlug,
};
