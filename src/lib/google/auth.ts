import { google } from "googleapis";
import path from "path";
import fs from "fs";

const SCOPES = [
  "https://www.googleapis.com/auth/webmasters.readonly",
  "https://www.googleapis.com/auth/analytics.readonly",
] as const;

/**
 * 구글 서비스 계정 인증 클라이언트를 생성합니다.
 * 1. 로컬 키 파일이 존재하면 해당 파일을 사용합니다.
 * 2. 배포 환경(Vercel 등)에서는 환경변수(EMAIL + PRIVATE_KEY)를 기반으로 인증합니다.
 */
export async function getGoogleAuthClient() {
  const localKeyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS || "postsync-api-9be9a8c8fa03.json";
  const localKeyPath = path.resolve(/*turbopackIgnore: true*/ process.cwd(), localKeyFilename);

  if (fs.existsSync(localKeyPath)) {
    const auth = new google.auth.GoogleAuth({
      keyFile: localKeyPath,
      scopes: [...SCOPES],
    });
    return auth.getClient();
  }

  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (clientEmail && privateKey) {
    if (privateKey.includes("\\n")) {
      privateKey = privateKey.replace(/\\n/g, "\n");
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: [...SCOPES],
    });
    return auth.getClient();
  }

  throw new Error(
    "Google 서비스 계정 자격 증명을 찾을 수 없습니다. 키 파일 또는 GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY 환경변수를 확인하세요."
  );
}
