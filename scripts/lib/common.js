/**
 * PostSync 자동화 스크립트 공용 런타임 · KST 날짜 · Google 인증 · Telegram API 헬퍼
 * (CI 환경 경량화를 위해 Node.js 내장 모듈만 사용)
 */

const fs = require("fs");
const path = require("path");
const net = require("net");

const DEFAULT_ROOT_DIR = path.resolve(__dirname, "../..");
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

function loadEnvLocal(rootDir = DEFAULT_ROOT_DIR) {
  const envPath = path.resolve(rootDir, ".env.local");
  if (!fs.existsSync(envPath)) return;

  const envContent = fs.readFileSync(envPath, "utf8");
  for (const line of envContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;

    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }

    if (process.env[key] === undefined || process.env[key] === "") {
      process.env[key] = val;
    }
  }
}

function initRuntime(rootDir = DEFAULT_ROOT_DIR) {
  // Windows IPv6 Happy Eyeballs 타임아웃(ETIMEDOUT) 방지
  net.setDefaultAutoSelectFamily(false);
  loadEnvLocal(rootDir);
}

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getKstDate(baseDate = new Date()) {
  const kst = new Date(baseDate.getTime() + KST_OFFSET_MS);
  const year = kst.getUTCFullYear();
  const month = kst.getUTCMonth() + 1;
  const day = kst.getUTCDate();
  const ymd = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return {
    year,
    month,
    day,
    hours: kst.getUTCHours(),
    minutes: kst.getUTCMinutes(),
    seconds: kst.getUTCSeconds(),
    ymd,
  };
}

function getKstYmd(offsetDays = 0, baseDate = new Date()) {
  const shifted = new Date(baseDate.getTime() + offsetDays * DAY_MS);
  return getKstDate(shifted).ymd;
}

function getKstYesterdayLabel(baseDate = new Date()) {
  const yesterday = new Date(baseDate.getTime() - DAY_MS);
  const { month, day } = getKstDate(yesterday);
  return `${month}월 ${day}일`;
}

function normalizeToYmd(input) {
  const raw = String(input || "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return "";
  return getKstDate(parsed).ymd;
}

function daysBetweenYmd(dateStrA, dateStrB, options = {}) {
  const { absolute = true } = options;
  const ymdA = normalizeToYmd(dateStrA);
  const ymdB = normalizeToYmd(dateStrB);
  if (!ymdA || !ymdB) return NaN;

  const [yA, mA, dA] = ymdA.split("-").map(Number);
  const [yB, mB, dB] = ymdB.split("-").map(Number);
  const utcA = Date.UTC(yA, mA - 1, dA);
  const utcB = Date.UTC(yB, mB - 1, dB);
  const diffDays = Math.floor((utcB - utcA) / DAY_MS);
  return absolute ? Math.abs(diffDays) : diffDays;
}

function createGoogleAuth(google, rootDir = DEFAULT_ROOT_DIR, scopes = []) {
  const resolvedScopes =
    scopes.length > 0
      ? scopes
      : [
          "https://www.googleapis.com/auth/webmasters.readonly",
          "https://www.googleapis.com/auth/analytics.readonly",
        ];

  const credEnv = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim() || "postsync-api-9be9a8c8fa03.json";
  const keyPath = path.isAbsolute(credEnv) ? credEnv : path.resolve(rootDir, credEnv);

  if (fs.existsSync(keyPath)) {
    return new google.auth.GoogleAuth({
      keyFile: keyPath,
      scopes: resolvedScopes,
    });
  }

  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;
  if (clientEmail && privateKey) {
    if (privateKey.includes("\\n")) {
      privateKey = privateKey.replace(/\\n/g, "\n");
    }
    return new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: resolvedScopes,
    });
  }

  throw new Error(
    `Google 서비스 계정 인증 정보를 찾을 수 없습니다 (${keyPath} 또는 GOOGLE_SERVICE_ACCOUNT_EMAIL/GOOGLE_PRIVATE_KEY 확인 필요).`
  );
}

async function sendTelegramMessage(text, options = {}) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) {
    throw new Error("TELEGRAM_BOT_TOKEN 또는 TELEGRAM_CHAT_ID가 설정되지 않았습니다.");
  }

  const {
    parseMode = "HTML",
    disableWebPagePreview = true,
    replyMarkup = undefined,
  } = options;

  const payload = {
    chat_id: chatId,
    text,
    parse_mode: parseMode,
    disable_web_page_preview: disableWebPagePreview,
  };
  if (replyMarkup) {
    payload.reply_markup = replyMarkup;
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok || !data.ok) {
    throw new Error(`텔레그램 발송 실패: ${data.description || res.statusText}`);
  }
  return data.result?.message_id;
}

async function getLatestTelegramOffset(token) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates?offset=-1&limit=1&timeout=0`);
    const data = await res.json();
    if (data.ok && Array.isArray(data.result) && data.result.length > 0) {
      return data.result[data.result.length - 1].update_id + 1;
    }
  } catch {
    // 네트워크 오류 시 0부터 폴백
  }
  return 0;
}

module.exports = {
  DEFAULT_ROOT_DIR,
  loadEnvLocal,
  initRuntime,
  escapeHtml,
  getKstDate,
  getKstYmd,
  getKstYesterdayLabel,
  normalizeToYmd,
  daysBetweenYmd,
  createGoogleAuth,
  sendTelegramMessage,
  getLatestTelegramOffset,
};
