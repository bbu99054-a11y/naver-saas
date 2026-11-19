/**
 * PostSync SEO 수정 작업 착수 전 텔레그램 1단계 결재 요청 및 승인 수신 스크립트
 *
 * 사용법:
 *   node scripts/request_edit_approval.js --summary "수정 요약" --wait-mins 30
 *   node scripts/request_edit_approval.js --send-only
 */

const path = require("path");
const fs = require("fs");
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

const APPROVE_COMMANDS = new Set(["승인", "수정승인", "수정진행", "수정해줘", "/approve", "approve"]);
const REJECT_COMMANDS = new Set(["보류", "취소", "/reject", "reject", "hold"]);

function getArg(flag, defaultVal = "") {
  const idx = process.argv.indexOf(flag);
  if (idx !== -1 && process.argv[idx + 1]) {
    return process.argv[idx + 1];
  }
  return defaultVal;
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
    reason: "텔레그램 결재 보류",
  });

  tracker.snoozedActions = filtered;
  tracker.updatedAt = new Date().toISOString();
  fs.writeFileSync(TRACKER_PATH, JSON.stringify(tracker, null, 2), "utf8");
  return snoozeDays;
}

async function sendEditApprovalMessage(text, actionId) {
  return sendTelegramMessage(text, {
    replyMarkup: {
      inline_keyboard: [
        [
          { text: "✅ 수정 진행 승인", callback_data: `edit_approve:${actionId}` },
          { text: "⏸️ 오늘 보류", callback_data: `edit_reject:${actionId}` },
        ],
      ],
    },
  });
}

async function waitForEditDecision(actionId, waitMins) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const targetChatId = process.env.TELEGRAM_CHAT_ID?.trim();
  const timeoutMs = waitMins * 60 * 1000;

  let offset = await getLatestTelegramOffset(token);
  const deadline = Date.now() + timeoutMs;
  console.log(`⏳ 텔레그램 수정 착수 승인 대기 중... (최대 ${waitMins}분, actionId: ${actionId})`);

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
              if (cbData === `edit_approve:${actionId}`) {
                await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    callback_query_id: cb.id,
                    text: "수정 진행 승인 확인 완료!",
                  }),
                });
                return "approved";
              }
              if (cbData === `edit_reject:${actionId}`) {
                await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    callback_query_id: cb.id,
                    text: "오늘 수정 보류 처리되었습니다.",
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
      // 일시적 오류 시 재시도
    }

    await new Promise((r) => setTimeout(r, 3000));
  }

  return "timeout";
}

async function main() {
  if (!fs.existsSync(PENDING_ACTION_PATH)) {
    throw new Error("pending-seo-action.json 파일이 없습니다. 먼저 collect_and_decide_seo.js를 실행하세요.");
  }

  const pending = JSON.parse(fs.readFileSync(PENDING_ACTION_PATH, "utf8"));
  const action = pending.selectedAction || {};
  const sendOnly = process.argv.includes("--send-only");

  if (action.caseCode === "CASE_0" || pending.status === "NO_OP") {
    console.log("ℹ️ 오늘 판정은 CASE_0 (NO_OP)이므로 수정 결재 알림 발송을 건너뜁니다.");
    return;
  }

  const customSummary = getArg("--summary", "");
  const waitMins = parseInt(getArg("--wait-mins", "60"), 10);

  const summaryBlock = customSummary
    ? `\n📝 <b>수정 제안 요약:</b>\n${escapeHtml(customSummary)}`
    : "";

  const altLines = (pending.alternativeCandidates || [])
    .slice(0, 3)
    .map(
      (c) =>
        `• <code>[${escapeHtml(c.caseCode)}]</code> ${escapeHtml(c.triggerQuery || c.targetPath)} (${c.priorityScore}점)`
    )
    .join("\n");

  const compLines = Object.values(pending.competitors || {})
    .map(
      (c) =>
        `• ${escapeHtml(c.name)}: 총 <b>${c.totalUrls}개</b> (최근 7일 ${c.weeklyActiveCount || 0}건 / 신규 +${c.newlyAddedSinceLastCheck || 0}건)`
    )
    .join("\n");

  if (sendOnly) {
    const noticeText = `🤖 <b>[PostSync SEO 판단 엔진] ${escapeHtml(pending.date)} 수정 권고 알림</b>

🎯 <b>오늘의 1순위 처방:</b> <code>[${escapeHtml(action.caseCode)}] ${escapeHtml(action.actionType)}</code> (${action.priorityScore ?? 0}점)
📍 <b>대상 경로:</b> <code>${escapeHtml(action.targetSlug || action.targetPath || "-")}</code>
🔑 <b>트리거 키워드:</b> <b>${escapeHtml(action.triggerQuery || action.targetTitle || "-")}</b>

📊 <b>감지 사유:</b>
${escapeHtml(action.reason)}${summaryBlock}
${altLines ? `\n📋 <b>차순위 후보 TOP 3</b>\n${altLines}` : ""}
${compLines ? `\n🔭 <b>경쟁사 사이트맵 현황</b>\n${compLines}` : ""}

👉 수정 진행을 원하시면 <b>Antigravity에 접속해</b> <code>오늘 SEO 수정 진행해</code>라고 말씀해 주세요.`;

    const messageId = await sendTelegramMessage(noticeText);
    console.log(`✅ 텔레그램 SEO 수정 권고 알림 발송 완료 (Message ID: ${messageId})`);
    return;
  }

  const text = `🛠️ <b>[PostSync SEO 수정 착수 1차 결재 요청]</b>

📅 <b>분석 일자:</b> ${escapeHtml(pending.date)}
🎯 <b>1순위 처방:</b> <code>[${escapeHtml(action.caseCode)}] ${escapeHtml(action.actionType)}</code>
📍 <b>대상 경로:</b> <code>${escapeHtml(action.targetSlug || action.targetPath || "-")}</code>
🔑 <b>트리거 키워드:</b> <b>${escapeHtml(action.triggerQuery || action.targetTitle || "-")}</b>

📊 <b>감지 사유:</b>
${escapeHtml(action.reason)}${summaryBlock}

아래 <b>[✅ 수정 진행 승인]</b> 버튼을 누르거나 채팅창에 <code>승인</code>이라고 답장하시면 로컬 수정 작업을 진행하도록 상태를 승인 처리합니다.`;

  const messageId = await sendEditApprovalMessage(text, pending.actionId);
  console.log(`✅ 텔레그램 수정 착수 결재 버튼 발송 완료 (Message ID: ${messageId})`);

  const decision = await waitForEditDecision(pending.actionId, waitMins);
  if (decision === "approved") {
    pending.status = "APPROVED_TO_EDIT";
    pending.editApprovedAt = new Date().toISOString();
    fs.writeFileSync(PENDING_ACTION_PATH, JSON.stringify(pending, null, 2), "utf8");
    console.log("✅ 수정 착수 승인 수신 완료! pending-seo-action.json 상태를 APPROVED_TO_EDIT로 갱신했습니다.");
    await sendTelegramMessage(
      `✅ <b>[수정 착수 승인 확인]</b>\n<code>${escapeHtml(pending.actionId)}</code> 건의 수정 진행 승인이 기록되었습니다.`
    );
  } else if (decision === "rejected") {
    pending.status = "REJECTED_HOLD";
    pending.editRejectedAt = new Date().toISOString();
    fs.writeFileSync(PENDING_ACTION_PATH, JSON.stringify(pending, null, 2), "utf8");
    const snoozeDays = recordRejectSnooze(action);
    console.log(`⏸️ 오늘 수정 보류 선택됨 (${snoozeDays}일 스누즈 기록).`);
    await sendTelegramMessage(
      `⏸️ <b>[오늘 수정 보류 완료]</b>\n수정을 보류했으며 향후 ${snoozeDays}일간 동일 항목 재추천을 보류합니다.`
    );
  } else {
    console.log(`⌛ 승인 대기 시간(${waitMins}분) 경과.`);
    await sendTelegramMessage(
      `⌛ <b>[수정 착수 승인 대기 시간(${waitMins}분) 경과]</b>\n응답이 없어 대기 종료했습니다.`
    );
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error("[Request Edit Approval Error]:", err.message);
    process.exit(1);
  });
}

module.exports = {
  recordRejectSnooze,
};
