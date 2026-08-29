const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const https = require("node:https");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sessionExpiredError(message = "네이버 세션이 만료되어 사용자 로그인이 필요합니다.") {
  const error = new Error(message);
  error.code = "SESSION_EXPIRED";
  return error;
}

async function gotoResilient(page, url, options = {}) {
  try {
    await page.goto(url, options);
    return true;
  } catch (error) {
    const message = String(error.message || "");
    if (/net::ERR_ABORTED|frame was detached|Navigation failed because page was closed/i.test(message)) {
      if (!(page.isClosed && page.isClosed())) {
        await page.waitForLoadState("domcontentloaded", { timeout: 5000 }).catch(() => {});
      }
      await sleep(1000);
      return false;
    }
    throw error;
  }
}

function activePage(context, fallbackPage) {
  const pages = context.pages().filter((item) => !item.isClosed());
  return pages.find((item) => item.url() && item.url() !== "about:blank") || pages[0] || fallbackPage;
}

function markChromeProfileClean(browserProfileDir) {
  const updateJsonFile = (filePath, mutate) => {
    try {
      if (!fs.existsSync(filePath)) return;
      const raw = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
      const data = raw ? JSON.parse(raw) : {};
      mutate(data);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    } catch {}
  };

  updateJsonFile(path.join(browserProfileDir, "Local State"), (data) => {
    data.profile = data.profile || {};
    data.profile.exit_type = "Normal";
    data.profile.exited_cleanly = true;
  });
}

function chromeLaunchOptions({ slowMo = 25, viewport = { width: 1366, height: 900 } } = {}) {
  return {
    channel: "chrome",
    chromiumSandbox: true,
    headless: false,
    slowMo,
    viewport,
    args: [
      "--hide-crash-restore-bubble",
      "--disable-session-crashed-bubble",
      "--no-first-run"
    ]
  };
}

async function safeClickLocator(_page, locator, _log = () => {}, _label = "요소") {
  await locator.scrollIntoViewIfNeeded().catch(() => {});
  try {
    await locator.click({ delay: 80, timeout: 5000 });
  } catch (error) {
    if (/se-popup|popup|intercepts pointer events/i.test(error.message || "")) {
      await dismissExistingDraftDialog(_page, _log);
      await locator.scrollIntoViewIfNeeded().catch(() => {});
      await locator.click({ delay: 80, timeout: 5000, force: true });
    } else {
      throw error;
    }
  }
  await sleep(120);
}

async function readBodyText(page) {
  return page.locator("body").innerText({ timeout: 1200 }).catch(() => "");
}

async function clickExactPopupButton(page, text) {
  const target = String(text || "").trim();
  const clickInRoot = async (root) => root.evaluate((buttonText) => {
    const visible = (element) => {
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    };
    const containers = Array.from(document.querySelectorAll(".se-popup-alert, [role='dialog'], [class*='layer'], [class*='popup']")).filter(visible);
    const roots = containers.length ? containers : [document.body];
    for (const container of roots) {
      const controls = Array.from(container.querySelectorAll("button, a"));
      const match = controls.find((control) => {
        if (!visible(control)) return false;
        const labels = [control.innerText, control.textContent, control.getAttribute("aria-label"), control.getAttribute("title")].map(v => String(v || "").trim());
        return labels.some(label => label === buttonText);
      });
      if (match) {
        match.click();
        return true;
      }
    }
    return false;
  }, target).catch(() => false);

  if (await clickInRoot(page)) return true;
  for (const frame of page.frames()) {
    if (await clickInRoot(frame)) return true;
  }
  return false;
}

async function dismissHelpPanel(page, log = () => {}) {
  const closeSelectors = [
    "button[class*='help_close']",
    "button[aria-label*='도움말 닫기']",
    "button[aria-label*='닫기']",
    ".se-help-panel button",
    "[class*='help_panel'] button[class*='close']",
    "button[data-click-area*='close']",
    "button[class*='btn_close']"
  ];
  for (const selector of closeSelectors) {
    const btn = page.locator(selector).first();
    if (await btn.isVisible().catch(() => false)) {
      await btn.click({ force: true }).catch(() => {});
      log("우측 도움말 안내 패널을 닫았습니다.");
      await sleep(300);
      return true;
    }
  }
  return false;
}

async function dismissExistingDraftDialog(page, log = () => {}) {
  await dismissHelpPanel(page, log);

  const bodyText = await readBodyText(page);
  const hasDraftText = /작성\s*중|작성하던|임시\s*저장|이어서|불러오|저장된\s*글/i.test(bodyText);
  if (!hasDraftText) return false;

  const cancelled = await clickExactPopupButton(page, "취소");
  if (!cancelled) {
    await page.keyboard.press("Escape").catch(() => {});
    await sleep(200);
    return true;
  }
  log("기존 임시 저장글 안내를 취소하고 새 글 작성을 시작합니다.");
  await sleep(500);
  return true;
}

async function collectVisibleLocators(page, selectors) {
  const selectorList = Array.isArray(selectors) ? selectors : [selectors];
  const items = [];

  for (const selector of selectorList.filter(Boolean)) {
    const locator = page.locator(selector);
    const count = await locator.count().catch(() => 0);
    for (let index = 0; index < count; index += 1) {
      const item = locator.nth(index);
      if (await item.isVisible().catch(() => false)) {
        items.push(item);
      }
    }
  }
  return items;
}

async function findVisibleLocator(page, selectors, timeout = 20000) {
  const deadline = Date.now() + timeout;
  const selectorList = Array.isArray(selectors) ? selectors : [selectors];

  while (Date.now() < deadline) {
    for (const selector of selectorList) {
      const locator = page.locator(selector);
      const count = await locator.count().catch(() => 0);
      for (let index = 0; index < count; index += 1) {
        const item = locator.nth(index);
        if (await item.isVisible().catch(() => false)) {
          return item;
        }
      }
    }
    await sleep(250);
  }
  throw new Error(`요소를 찾을 수 없습니다: ${selectorList.join(", ")}`);
}

// 🖼️ Base64 이미지 디코딩 및 로컬 파일 캐싱 함수 (0바이트 방지)
async function saveBase64ImageToFile(imgSource, targetPath) {
  if (imgSource.startsWith("data:image/")) {
    const base64Data = imgSource.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    if (buffer.length > 100) {
      fs.writeFileSync(targetPath, buffer);
      return targetPath;
    }
  }

  if (imgSource.startsWith("http://") || imgSource.startsWith("https://")) {
    return new Promise((resolve, reject) => {
      const client = imgSource.startsWith("https") ? https : http;
      const file = fs.createWriteStream(targetPath);
      client.get(imgSource, (response) => {
        response.pipe(file);
        file.on("finish", () => {
          file.close(() => {
            const stat = fs.statSync(targetPath);
            if (stat.size > 100) {
              resolve(targetPath);
            } else {
              fs.unlink(targetPath, () => {});
              reject(new Error("다운로드된 파일 크기가 0바이트입니다."));
            }
          });
        });
      }).on("error", (err) => {
        fs.unlink(targetPath, () => {});
        reject(err);
      });
    });
  }

  throw new Error("유효하지 않은 이미지 소스 포맷입니다.");
}

// 🔐 [핵심] 로그인 체크 및 블로그 글쓰기 주소 도출
async function ensureLoggedInAndResolveBlogId(page, context, explicitBlogId, log) {
  let resolvedId = explicitBlogId ? String(explicitBlogId).trim() : "";
  if (resolvedId) {
    log(`🎯 지정된 네이버 블로그 ID로 즉시 연결: "${resolvedId}"`);
    return `https://blog.naver.com/${encodeURIComponent(resolvedId)}/postwrite`;
  }

  log("🔍 로그인된 계정의 네이버 블로그 주소를 자동으로 감지합니다...");
  try {
    await gotoResilient(page, "https://admin.blog.naver.com", { waitUntil: "domcontentloaded", timeout: 20000 });
    await sleep(1500);
    const adminUrl = page.url();
    const adminMatch = adminUrl.match(/admin\.blog\.naver\.com\/([a-zA-Z0-9_-]+)/i);
    if (adminMatch && adminMatch[1] && !/^(admin|main|home|login)$/i.test(adminMatch[1])) {
      resolvedId = adminMatch[1];
      log(`🎯 네이버 블로그 ID 감지 성공 (관리자 경로): "${resolvedId}"`);
    }
  } catch {}

  if (!resolvedId) {
    log("블로그 ID 감지에 실패하여 기본 글쓰기 게이트웨이로 진입합니다.");
    return "https://blog.naver.com/postwrite";
  }

  return `https://blog.naver.com/${encodeURIComponent(resolvedId)}/postwrite`;
}

async function waitForPostWriteEditor(page, selectors, postWriteUrl, log, timeout = 300000) {
  const deadline = Date.now() + timeout;
  let hasNotifiedLogin = false;

  while (Date.now() < deadline) {
    const currentUrl = page.url();

    // 1. 로그인 화면 감지 시 대기
    if (/nid\.naver\.com\/nidlogin/i.test(currentUrl)) {
      if (!hasNotifiedLogin) {
        log("🔑 [로그인 필요] 네이버 로그인 창이 열렸습니다. 브라우저에서 1회 로그인을 완료해 주세요!");
        hasNotifiedLogin = true;
      }
      await sleep(1500);
      continue;
    }

    // 2. 로그인 완료 후 글쓰기 페이지로 재진입
    if (hasNotifiedLogin && !/postwrite/i.test(currentUrl)) {
      log("🎉 로그인을 확인했습니다! 블로그 글쓰기 화면으로 이동합니다...");
      await gotoResilient(page, postWriteUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
      hasNotifiedLogin = false;
      await sleep(2000);
      continue;
    }

    await dismissExistingDraftDialog(page, log);

    const titleSelector = [
      ".se-documentTitle [contenteditable='true']",
      ".se-title-text [contenteditable='true']",
      ".se-title [contenteditable='true']",
      ".se-section-documentTitle [contenteditable='true']",
      "p[class*='se-placeholder'][class*='title']",
      "span[class*='se-placeholder']",
      ".se-ff-nanumgothic.se-fs32",
      ".se-component-content [contenteditable='true']",
      ".se-documentTitle",
      "textarea[placeholder*='제목']",
      "input[placeholder*='제목']"
    ];

    for (const sel of titleSelector) {
      const loc = page.locator(sel).first();
      if (await loc.isVisible().catch(() => false)) {
        log("스마트에디터 글쓰기 화면 진입을 확인했습니다.");
        return loc;
      }
    }

    // 에디터 화면이 아니고 로그인도 아니면 재진입 시도
    if (!/postwrite/i.test(page.url()) && !/nid\.naver\.com/i.test(page.url())) {
      log(`블로그 글쓰기 URL로 재진입합니다: ${postWriteUrl}`);
      await gotoResilient(page, postWriteUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
      await sleep(2000);
    }

    await sleep(600);
  }

  throw new Error("스마트에디터 제목 입력 영역을 찾지 못했습니다. 네이버 로그인 상태를 확인해 주세요.");
}

// 💾 [안전 임시저장 버튼 클릭]
async function clickSaveDraftButton(page, log) {
  const saveSelectors = [
    "button[data-click-area='tpb.save']",
    "button.se-save-button",
    "button:has-text('저장')",
    "[data-click-area='tpb.save']"
  ];

  for (const selector of saveSelectors) {
    const candidates = await collectVisibleLocators(page, selector);
    if (candidates[0]) {
      await safeClickLocator(page, candidates[0], log, "상단 임시저장 버튼");
      return true;
    }
  }
  return false;
}

// 🚀 [최종 메인 함수: 아이디어 2 최하단 커서 고정 & 정품 사진 파일 순차 첨부]
async function publishToNaver(options = {}) {
  const {
    title,
    content,
    article,
    blogId = "",
    runtimeRoot = process.cwd(),
    log = console.log
  } = options;

  let playwright;
  try {
    playwright = require("playwright-core");
  } catch (e) {
    throw new Error("playwright-core가 로컬에 설치되어 있지 않습니다.");
  }

  const rawHtml = content || article || "";

  // 1. Base64 카드뉴스 + 하단 배너 이미지 전수 실체화 (0바이트 방지)
  const tempImagesDir = path.join(runtimeRoot, "temp-images");
  fs.mkdirSync(tempImagesDir, { recursive: true });

  const imageSources = Array.isArray(options.images) && options.images.length > 0
    ? options.images
    : Array.from(rawHtml.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)).map(m => m[1]);

  const localImagePaths = [];
  for (let i = 0; i < imageSources.length; i++) {
    const src = imageSources[i];
    const targetPath = path.join(tempImagesDir, `card_image_${i + 1}.png`);
    try {
      log(`📥 인포그래픽 이미지 [${i + 1}/${imageSources.length}] 실체화 중...`);
      await saveBase64ImageToFile(src, targetPath);
      const stat = fs.statSync(targetPath);
      if (stat.size > 100) {
        localImagePaths.push(targetPath);
        log(`✨ 이미지 [${i + 1}] 준비 완료 (${(stat.size / 1024).toFixed(1)} KB)`);
      }
    } catch (err) {
      log(`이미지 처리 실패: ${err.message}`, "warn");
    }
  }

  const selectors = {
    titleInput: [
      ".se-documentTitle [contenteditable='true']",
      ".se-title-text [contenteditable='true']",
      "textarea[placeholder*='제목']",
      "input[placeholder*='제목']"
    ],
    bodyEditor: [
      ".se-section-text .se-module-text",
      ".se-section-text [contenteditable='true']",
      "div[contenteditable='true']"
    ],
    imageButton: [
      "button[aria-label*='사진']",
      "button[title*='사진']",
      "button[aria-label*='이미지']",
      "button[title*='이미지']",
      ".se-toolbar-item-image button",
      ".se-image-toolbar-button",
      "button[data-name='image']",
      "button[data-name='photo']",
      "button[class*='image']",
      "button[class*='photo']"
    ]
  };

  const browserProfileDir = path.join(runtimeRoot, "browser-profile");
  fs.mkdirSync(browserProfileDir, { recursive: true });
  markChromeProfileClean(browserProfileDir);

  log("🌐 네이버 전용 브라우저 세션을 실행합니다...");
  const context = await playwright.chromium.launchPersistentContext(
    browserProfileDir,
    chromeLaunchOptions()
  );

  try {
    let page = context.pages()[0] || (await context.newPage());

    // 1. 로그인 확인 및 블로그 글쓰기 주소 도출
    const postWriteUrl = await ensureLoggedInAndResolveBlogId(page, context, blogId, log);

    log(`🚀 블로그 글쓰기 페이지 진입: ${postWriteUrl}`);
    await gotoResilient(page, postWriteUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
    page = activePage(context, page);

    // 2. 스마트에디터 로드 대기 및 제목창 포커스
    const titleLocator = await waitForPostWriteEditor(page, selectors, postWriteUrl, log);

    // 3. 제목 입력
    log(`✍️ 제목 입력 중: "${title}"`);
    await safeClickLocator(page, titleLocator, log, "제목 입력칸");
    await page.keyboard.press("Control+A");
    await page.keyboard.type(String(title || "").trim(), { delay: 25 });
    await page.keyboard.press("Enter");
    await sleep(1000); // 1초 대기

    // 4. 본문 영역 최초 1회 포커스
    const bodyLocator = await findVisibleLocator(page, selectors.bodyEditor, 10000);
    await safeClickLocator(page, bodyLocator, log, "본문 입력 영역 최초 활성화");
    await sleep(300);

    // 5. 본문 HTML을 원래 이미지 위치 기준으로 정밀 분할 (문장 쪼개짐 0%)
    const textChunks = rawHtml
      .split(/(?:<figure[^>]*>)?\s*<img[^>]*>\s*(?:<\/figure>)?/gi)
      .map(chunk => chunk.trim());

    log(`📝 [정방향 순차 주입] 본문 텍스트 ${textChunks.length}개 블록 & 정품 사진 ${localImagePaths.length}장 주입 시작...`);

    // 6. [핵심] 상단 재클릭 없이 항상 맨 밑바닥(End 키)에서만 아래로 순차 주입
    for (let i = 0; i < textChunks.length; i++) {
      const chunk = textChunks[i];
      if (chunk) {
        log(`📝 [텍스트 블록 ${i + 1}/${textChunks.length}] 서식/표 스마트 주입 중...`);
        await page.evaluate((html) => {
          const handler = (e) => {
            e.clipboardData.setData("text/html", html);
            e.clipboardData.setData("text/plain", html.replace(/<[^>]*>/g, ""));
            e.preventDefault();
            document.removeEventListener("copy", handler);
          };
          document.addEventListener("copy", handler);
          document.execCommand("copy");
        }, chunk);

        await page.keyboard.press("Control+V");
        await sleep(1000); // 1초 대기

        // 텍스트 붙여넣기 후 커서를 항상 텍스트 맨 끝(아래)으로 이동
        await page.keyboard.press("End").catch(() => {});
        await page.keyboard.press("Enter").catch(() => {});
        await sleep(300);
      }

      // 해당 위치의 정품 사진 첨부
      if (i < localImagePaths.length) {
        log(`🖼️ [정품 사진 ${i + 1}/${localImagePaths.length}] 파일 첨부 중 (${path.basename(localImagePaths[i])})...`);
        try {
          const chooserPromise = page.waitForEvent("filechooser", { timeout: 15000 });
          const button = await findVisibleLocator(page, selectors.imageButton, 15000);
          await safeClickLocator(page, button, log, "상단 사진 버튼");
          const chooser = await chooserPromise;
          await chooser.setFiles(localImagePaths[i]);

          log(`✅ 정품 사진 [${i + 1}] 업로드 완료 -> 네이버 렌더링 대기 중...`);
          await sleep(2500); // 네이버 서버 업로드 및 컴포넌트 렌더링 대기

          // 사진 아래 커서로 이동
          await page.keyboard.press("End").catch(() => {});
          await page.keyboard.press("Enter").catch(() => {});
          await sleep(1000); // 1초 대기
        } catch (imgErr) {
          log(`사진 첨부 실패: ${imgErr.message}`, "warn");
        }
      }
    }

    log("✅ 모든 본문 서식과 정품 사진 N장(카드뉴스 + 하단 배너) 정방향 삽입 완료!");
    await sleep(1000); // 1초 대기

    // 7. 상단 우측 [저장] (임시저장) 버튼 클릭
    log("💾 [안전 임시저장] 상단 저장 버튼을 클릭합니다...");
    const saved = await clickSaveDraftButton(page, log);
    if (saved) {
      log("🎉 네이버 스마트에디터에 안전하게 [임시저장] 되었습니다! (직접 확인 후 발행하실 수 있습니다)");
    }

    await sleep(3000);

    return {
      success: true,
      message: "네이버 스마트에디터 안전 임시저장 완료",
      savedAt: new Date().toISOString()
    };
  } finally {
    await sleep(2000);
    await context.close().catch(() => {});
  }
}

module.exports = {
  publishToNaver
};
