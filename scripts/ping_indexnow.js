/**
 * PostSync IndexNow 멀티 검색엔진(네이버 서치어드바이저 · Bing/ChatGPT) 즉시 색인 핑 유틸리티
 *
 * 사용법:
 *   node scripts/ping_indexnow.js --dry-run
 *   node scripts/ping_indexnow.js --urls=https://www.postsyncapp.com/place/clinic,https://www.postsyncapp.com/blog/naver-place-rank-checker-free
 *   node scripts/ping_indexnow.js
 */

const fs = require("fs");
const path = require("path");
const net = require("net");

const ROOT_DIR = path.resolve(__dirname, "..");
const HOST = "www.postsyncapp.com";
const BASE_URL = `https://${HOST}`;
const INDEXNOW_KEY = "9b4f8c2a1e7d4506a93c2f81e4b6d0c3";
const KEY_LOCATION = `${BASE_URL}/${INDEXNOW_KEY}.txt`;

const INDEXNOW_ENDPOINTS = [
  { name: "Naver IndexNow", url: "https://searchadvisor.naver.com/indexnow" },
  { name: "IndexNow Global (Bing/ChatGPT)", url: "https://api.indexnow.org/indexnow" },
];

const CORE_STATIC_PATHS = [
  "/",
  "/place",
  "/tools",
  "/blog",
  "/convert",
  "/adcheck",
  "/utm",
  "/guide",
  "/about",
  "/contact",
  "/hwpx",
  "/rss.xml",
];

function extractSlugsFromFile(relPath, sliceStartMarker = null, sliceEndMarker = null) {
  const fullPath = path.resolve(ROOT_DIR, relPath);
  if (!fs.existsSync(fullPath)) return [];

  let content = fs.readFileSync(fullPath, "utf8");
  if (sliceStartMarker) {
    const startIdx = content.indexOf(sliceStartMarker);
    if (startIdx !== -1) content = content.slice(startIdx);
  }
  if (sliceEndMarker) {
    const endIdx = content.indexOf(sliceEndMarker);
    if (endIdx !== -1) content = content.slice(0, endIdx);
  }

  const slugs = [];
  const regex = /\bslug:\s*['"]([a-z0-9-]+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    slugs.push(match[1]);
  }
  return Array.from(new Set(slugs));
}

function collectAllSiteUrls() {
  const urls = new Set(CORE_STATIC_PATHS.map((p) => (p === "/" ? BASE_URL : `${BASE_URL}${p}`)));

  const industrySlugs = extractSlugsFromFile(
    "src/lib/industryPlaceData.ts",
    "export const INDUSTRY_PLACE_LIST",
    "export function getIndustryProfile"
  );
  for (const slug of industrySlugs) {
    urls.add(`${BASE_URL}/place/${slug}`);
  }

  const pSeoSlugs = extractSlugsFromFile("src/lib/pSeoPlacePosts.ts");
  const coreBlogSlugs = extractSlugsFromFile(
    "src/lib/blogData.ts",
    "export const blogPosts"
  );
  const allBlogSlugs = new Set([...pSeoSlugs, ...coreBlogSlugs]);
  for (const slug of allBlogSlugs) {
    urls.add(`${BASE_URL}/blog/${slug}`);
  }

  return Array.from(urls);
}

async function pingIndexNow(urls = [], options = {}) {
  const { dryRun = false, timeoutMs = 15000 } = options;

  const keyFilePath = path.resolve(ROOT_DIR, "public", `${INDEXNOW_KEY}.txt`);
  if (!fs.existsSync(keyFilePath)) {
    return {
      attempted: false,
      urlCount: 0,
      results: [],
      message: `IndexNow 키 파일(${keyFilePath})이 존재하지 않아 전송을 건너뛰었습니다.`,
    };
  }

  const deduped = Array.from(
    new Set(
      (urls || [])
        .map((u) => String(u || "").trim())
        .filter((u) => u.startsWith(`https://${HOST}`))
    )
  ).slice(0, 10000);

  if (deduped.length === 0) {
    return {
      attempted: false,
      urlCount: 0,
      results: [],
      message: "전송할 유효한 PostSync 도메인 URL이 없습니다.",
    };
  }

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: deduped,
  };

  if (dryRun) {
    return {
      attempted: false,
      dryRun: true,
      urlCount: deduped.length,
      keyLocation: KEY_LOCATION,
      endpoints: INDEXNOW_ENDPOINTS.map((e) => e.url),
      urls: deduped,
      message: `[Dry-Run] ${deduped.length}개 URL IndexNow 페이로드 생성 완료`,
    };
  }

  const results = [];
  for (const ep of INDEXNOW_ENDPOINTS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(ep.url, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const bodyText = await res.text().catch(() => "");
      const ok = res.status === 200 || res.status === 202;
      results.push({
        name: ep.name,
        endpoint: ep.url,
        status: res.status,
        ok,
        body: bodyText.slice(0, 200),
      });
    } catch (err) {
      results.push({
        name: ep.name,
        endpoint: ep.url,
        status: 0,
        ok: false,
        error: err.message,
      });
    } finally {
      clearTimeout(timer);
    }
  }

  const okCount = results.filter((r) => r.ok).length;
  const summaryParts = results.map((r) => `${r.name}:${r.ok ? `HTTP ${r.status}` : r.error || `HTTP ${r.status}`}`);
  return {
    attempted: true,
    urlCount: deduped.length,
    okCount,
    results,
    message: `IndexNow ${deduped.length}건 전송 (${summaryParts.join(", ")})`,
  };
}

if (require.main === module) {
  net.setDefaultAutoSelectFamily(false);

  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const urlsArg = args.find((a) => a.startsWith("--urls="));
  const targetUrls = urlsArg
    ? urlsArg
        .slice("--urls=".length)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : collectAllSiteUrls();

  pingIndexNow(targetUrls, { dryRun })
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
      if (!dryRun && result.attempted && result.okCount === 0) {
        process.exitCode = 1;
      }
    })
    .catch((err) => {
      console.error("[IndexNow Error]:", err.message);
      process.exit(1);
    });
}

module.exports = {
  collectAllSiteUrls,
  pingIndexNow,
  INDEXNOW_KEY,
  KEY_LOCATION,
};
