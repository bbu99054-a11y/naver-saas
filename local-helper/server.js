const http = require("node:http");
const { publishToNaver } = require("./naverEngine");

const PORT = process.env.PORT || 49152;

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

let isPublishing = false;

function cleanHtmlToNaverArticle(html) {
  return String(html || "")
    .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, "\n[SECTION - $1]\n")
    .replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<li[^>]*>(.*?)<\/li>/gi, "• $1\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  // Preflight OPTIONS 요청 처리
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  // 1. Health Check
  if (req.method === "GET" && url.pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({
      status: "ok",
      version: "1.0.0",
      isPublishing,
      message: "PostSynk Local Helper is running smoothly."
    }));
    return;
  }

  // 2. 네이버 원클릭 자동 발행 API
  if (req.method === "POST" && url.pathname === "/publish/naver") {
    if (isPublishing) {
      res.writeHead(429, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({
        success: false,
        error: "이미 다른 글을 네이버에 발행 중입니다. 잠시만 기다려 주세요."
      }));
      return;
    }

    let body = "";
    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const payload = JSON.parse(body || "{}");
        const { title, content, tags, images, blogId, naverId, naverPassword } = payload;

        if (!title || !content) {
          res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({
            success: false,
            error: "제목과 본문 내용은 필수 항목입니다."
          }));
          return;
        }

        isPublishing = true;
        console.log(`\n========================================`);
        console.log(`[PostSynk Helper] 네이버 원클릭 발행 시작: "${title}"`);
        console.log(`========================================`);

        const articleText = cleanHtmlToNaverArticle(content);
        const cleanTags = (Array.isArray(tags) ? tags : [])
          .map(t => String(t || "").replace(/^#+/, "").trim())
          .filter(Boolean);

        const result = await publishToNaver({
          title: String(title).trim(),
          content: content,
          article: content,
          tags: Array.isArray(tags) ? tags : [],
          images: Array.isArray(images) ? images : [],
          blogId: blogId || naverId || "",
          runtimeRoot: __dirname,
          log: (msg, level = "info") => console.log(`[Naver Engine][${level}] ${msg}`)
        });

        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({
          success: true,
          result
        }));
      } catch (error) {
        console.error("[PostSynk Helper Error]", error);
        res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({
          success: false,
          error: error.message || "네이버 자동 발행 중 오류가 발생했습니다."
        }));
      } finally {
        isPublishing = false;
      }
    });
    return;
  }

  // 404 Not Found
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Route not found" }));
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`\n✨ ===================================================`);
  console.log(`🚀 [PostSynk Local Helper] 로컬 브릿지 서버가 실행되었습니다.`);
  console.log(`📡 포트: http://127.0.0.1:${PORT}`);
  console.log(`🔗 SaaS 대시보드와 연결 대기 중입니다...`);
  console.log(`✨ ===================================================\n`);
});
