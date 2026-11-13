/**
 * Telegram Bot API 메시지 발송 모듈
 */

export interface SendTelegramOptions {
  parseMode?: "HTML" | "Markdown" | "MarkdownV2";
  disableWebPagePreview?: boolean;
  replyMarkup?: Record<string, unknown>;
}

export async function sendTelegramMessage(
  text: string,
  options: SendTelegramOptions = { parseMode: "HTML", disableWebPagePreview: true }
): Promise<{ success: boolean; messageId?: number; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

  if (!token || !chatId) {
    const errMsg = "TELEGRAM_BOT_TOKEN 또는 TELEGRAM_CHAT_ID 환경변수가 설정되지 않았습니다.";
    console.warn(`[Telegram Bot] ${errMsg}`);
    return { success: false, error: errMsg };
  }

  try {
    const payload: Record<string, unknown> = {
      chat_id: chatId,
      text,
      disable_web_page_preview: options.disableWebPagePreview ?? true,
    };

    if (options.parseMode) {
      payload.parse_mode = options.parseMode;
    }

    if (options.replyMarkup) {
      payload.reply_markup = options.replyMarkup;
    }

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      const errMsg = `텔레그램 발송 실패: ${data.description || response.statusText}`;
      console.error(`[Telegram Bot] ${errMsg}`);
      return { success: false, error: errMsg };
    }

    return { success: true, messageId: data.result?.message_id };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error(`[Telegram Bot Network Error]:`, errMsg);
    return { success: false, error: errMsg };
  }
}

/**
 * 텔레그램 인라인 승인/보류 버튼이 포함된 결재 요청 메시지를 발송합니다.
 */
export async function sendTelegramApprovalRequest(
  text: string,
  actionId: string
): Promise<{ success: boolean; messageId?: number; error?: string }> {
  return sendTelegramMessage(text, {
    parseMode: "HTML",
    disableWebPagePreview: true,
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

/**
 * 대표님의 텔레그램 인라인 버튼 클릭 또는 텍스트 답장('승인' / '보류')을 대기합니다.
 */
export async function waitForTelegramApproval(options: {
  actionId: string;
  timeoutMs?: number;
  pollIntervalMs?: number;
}): Promise<{ decision: "approved" | "rejected" | "timeout"; actor?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const targetChatId = process.env.TELEGRAM_CHAT_ID?.trim();
  const timeoutMs = options.timeoutMs ?? 30 * 60 * 1000;
  const pollIntervalMs = options.pollIntervalMs ?? 4000;

  if (!token || !targetChatId) {
    return { decision: "timeout" };
  }

  let offset = 0;
  try {
    const initRes = await fetch(`https://api.telegram.org/bot${token}/getUpdates?limit=5&timeout=0`);
    const initData = await initRes.json();
    if (initData.ok && Array.isArray(initData.result) && initData.result.length > 0) {
      const lastUpdate = initData.result[initData.result.length - 1];
      offset = lastUpdate.update_id + 1;
    }
  } catch {
    // 초기 오프셋 조회 실패 시 0부터 시작
  }

  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    try {
      const res = await fetch(
        `https://api.telegram.org/bot${token}/getUpdates?offset=${offset}&timeout=10`,
        { method: "GET" }
      );
      const data = await res.json();

      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          offset = update.update_id + 1;

          // 1) 인라인 버튼 콜백 처리
          if (update.callback_query) {
            const cb = update.callback_query;
            const cbChatId = String(cb.message?.chat?.id || "");
            const cbData = String(cb.data || "");

            if (cbChatId === targetChatId) {
              if (cbData === `approve:${options.actionId}`) {
                await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    callback_query_id: cb.id,
                    text: "승인 완료! GitHub 푸시 및 색인 요청을 시작합니다.",
                  }),
                });
                return { decision: "approved", actor: cb.from?.first_name || "대표님" };
              }
              if (cbData === `reject:${options.actionId}`) {
                await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    callback_query_id: cb.id,
                    text: "오늘 SEO 자동 반영을 보류했습니다.",
                  }),
                });
                return { decision: "rejected", actor: cb.from?.first_name || "대표님" };
              }
            }
          }

          // 2) 일반 텍스트 답장 처리 ('승인', '/approve', '푸시', '보류', '/reject')
          if (update.message && String(update.message.chat?.id || "") === targetChatId) {
            const msgText = String(update.message.text || "").trim().toLowerCase();
            if (["승인", "푸시", "푸시해줘", "/approve", "approve", "ok", "ㅇㅇ"].includes(msgText)) {
              return { decision: "approved", actor: update.message.from?.first_name || "대표님" };
            }
            if (["보류", "취소", "/reject", "reject", "hold"].includes(msgText)) {
              return { decision: "rejected", actor: update.message.from?.first_name || "대표님" };
            }
          }
        }
      }
    } catch {
      // 일시적 네트워크 지연 시 다음 폴링 시도
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  return { decision: "timeout" };
}
