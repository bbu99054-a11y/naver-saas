const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const outputDir = path.join(__dirname, '..', 'public', 'kakao');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 1. 대형 3구획 HTML (2500 x 1686)
const html3Split = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif; }
    body {
      width: 2500px;
      height: 1686px;
      overflow: hidden;
      display: flex;
      background: #090D16;
      color: #fff;
    }
    .col {
      flex: 1;
      height: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 100px 70px 100px 70px;
      border-right: 2px solid rgba(255, 255, 255, 0.08);
      box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.5);
    }
    .col:last-child {
      border-right: none;
    }

    /* Col 1 - 순위조회 (네온 블루) */
    .col-1 {
      background: linear-gradient(175deg, #0B1528 0%, #060A13 100%);
    }
    .col-1::before {
      content: '';
      position: absolute;
      top: -150px;
      left: 50%;
      transform: translateX(-50%);
      width: 700px;
      height: 700px;
      background: radial-gradient(circle, rgba(14, 165, 233, 0.25) 0%, transparent 70%);
      pointer-events: none;
    }

    /* Col 2 - 전자책 (인디고 / 앰버) */
    .col-2 {
      background: linear-gradient(175deg, #130E26 0%, #080614 100%);
    }
    .col-2::before {
      content: '';
      position: absolute;
      top: -150px;
      left: 50%;
      transform: translateX(-50%);
      width: 700px;
      height: 700px;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.22) 0%, transparent 70%);
      pointer-events: none;
    }

    /* Col 3 - 1:1 상담 (카카오 옐로우 & 골드) */
    .col-3 {
      background: linear-gradient(175deg, #1F1905 0%, #0E0B02 100%);
    }
    .col-3::before {
      content: '';
      position: absolute;
      top: -150px;
      left: 50%;
      transform: translateX(-50%);
      width: 700px;
      height: 700px;
      background: radial-gradient(circle, rgba(254, 229, 0, 0.22) 0%, transparent 70%);
      pointer-events: none;
    }

    /* 상단 뱃지 */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 14px;
      padding: 16px 36px;
      border-radius: 9999px;
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.5px;
      width: fit-content;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }
    .badge-blue {
      background: rgba(14, 165, 233, 0.15);
      color: #38BDF8;
      border: 2px solid rgba(56, 189, 248, 0.4);
    }
    .badge-purple {
      background: rgba(168, 85, 247, 0.15);
      color: #C084FC;
      border: 2px solid rgba(192, 132, 252, 0.4);
    }
    .badge-yellow {
      background: rgba(254, 229, 0, 0.15);
      color: #FEE500;
      border: 2px solid rgba(254, 229, 0, 0.4);
    }

    /* 중앙 메인 아이콘 & 텍스트 */
    .content-box {
      margin-top: 40px;
    }
    .icon-wrapper {
      width: 220px;
      height: 220px;
      border-radius: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 50px;
      box-shadow: 0 25px 60px rgba(0,0,0,0.4);
    }
    .icon-blue {
      background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%);
      border: 3px solid rgba(56, 189, 248, 0.5);
    }
    .icon-purple {
      background: linear-gradient(135deg, #9333EA 0%, #6B21A8 100%);
      border: 3px solid rgba(192, 132, 252, 0.5);
    }
    .icon-yellow {
      background: linear-gradient(135deg, #FEE500 0%, #EAB308 100%);
      border: 3px solid rgba(254, 229, 0, 0.7);
    }

    .title {
      font-size: 68px;
      font-weight: 900;
      line-height: 1.25;
      letter-spacing: -1.5px;
      margin-bottom: 24px;
    }
    .title-highlight-blue {
      color: #38BDF8;
    }
    .title-highlight-purple {
      color: #E879F9;
    }
    .title-highlight-yellow {
      color: #FEE500;
    }

    .desc {
      font-size: 34px;
      font-weight: 500;
      line-height: 1.5;
      color: #94A3B8;
      letter-spacing: -0.5px;
    }

    /* 하단 액션 버튼 */
    .btn-action {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 130px;
      padding: 0 45px;
      border-radius: 32px;
      font-size: 38px;
      font-weight: 800;
      letter-spacing: -0.5px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    }
    .btn-blue {
      background: #0284C7;
      color: #FFFFFF;
      border: 2px solid #38BDF8;
    }
    .btn-purple {
      background: #7E22CE;
      color: #FFFFFF;
      border: 2px solid #C084FC;
    }
    .btn-yellow {
      background: #FEE500;
      color: #191600;
      border: 2px solid #FFF;
    }

    .arrow-icon {
      font-size: 44px;
    }
  </style>
</head>
<body>
  <!-- 구역 1: 실시간 순위 조회 -->
  <div class="col col-1">
    <div>
      <div class="badge badge-blue">⚡ 1초 실시간 무료 진단</div>
      <div class="content-box">
        <div class="icon-wrapper icon-blue">
          <svg width="110" height="110" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </div>
        <h1 class="title">내 매장<br><span class="title-highlight-blue">실시간 순위 조회</span></h1>
        <p class="desc">네이버 플레이스 1~20위<br>실시간 노출 순위 1초 판독</p>
      </div>
    </div>
    <div class="btn-action btn-blue">
      <span>지금 순위 확인</span>
      <span class="arrow-icon">➔</span>
    </div>
  </div>

  <!-- 구역 2: 2026 공략 전자책 -->
  <div class="col col-2">
    <div>
      <div class="badge badge-purple">📘 2026 최신 개정판</div>
      <div class="content-box">
        <div class="icon-wrapper icon-purple">
          <svg width="110" height="110" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            <line x1="9" y1="7" x2="15" y2="7"></line>
            <line x1="9" y1="11" x2="15" y2="11"></line>
          </svg>
        </div>
        <h1 class="title">플레이스 1위<br><span class="title-highlight-purple">비밀 공략집 열람</span></h1>
        <p class="desc">2026 최신 알고리즘 해독<br>상위노출 1위 비법서 무료 배포</p>
      </div>
    </div>
    <div class="btn-action btn-purple">
      <span>무료 전자책 보기</span>
      <span class="arrow-icon">➔</span>
    </div>
  </div>

  <!-- 구역 3: 전문가 1:1 상담 -->
  <div class="col col-3">
    <div>
      <div class="badge badge-yellow">💬 1:1 전문가 정밀 진단</div>
      <div class="content-box">
        <div class="icon-wrapper icon-yellow">
          <svg width="110" height="110" viewBox="0 0 24 24" fill="none" stroke="#191600" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            <line x1="8" y1="10" x2="16" y2="10"></line>
            <line x1="8" y1="14" x2="12" y2="14"></line>
          </svg>
        </div>
        <h1 class="title">플레이스 상위노출<br><span class="title-highlight-yellow">1:1 정밀 상담</span></h1>
        <p class="desc">순위 급락 원인 분석 &<br>1위 동기화 솔루션 실시간 문의</p>
      </div>
    </div>
    <div class="btn-action btn-yellow">
      <span>1:1 상담 시작하기</span>
      <span class="arrow-icon">➔</span>
    </div>
  </div>
</body>
</html>
`;

// 2. 대형 4구획 HTML (2500 x 1686, 상단 1개 + 하단 3개)
const html4Split = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif; }
    body {
      width: 2500px;
      height: 1686px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      background: #090D16;
      color: #fff;
    }
    
    /* 상단 와이드 (2500 x 843) */
    .top-section {
      width: 100%;
      height: 843px;
      background: linear-gradient(135deg, #091938 0%, #060E1E 50%, #0B1120 100%);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 100px;
      border-bottom: 3px solid rgba(255, 255, 255, 0.1);
      box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.6);
    }
    .top-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 15%;
      width: 900px;
      height: 800px;
      background: radial-gradient(circle, rgba(14, 165, 233, 0.28) 0%, transparent 70%);
      pointer-events: none;
    }

    .top-left {
      max-width: 1400px;
    }
    .badge-live {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 14px 32px;
      background: rgba(14, 165, 233, 0.15);
      color: #38BDF8;
      border: 2px solid rgba(56, 189, 248, 0.4);
      border-radius: 9999px;
      font-size: 30px;
      font-weight: 800;
      margin-bottom: 24px;
    }
    .top-title {
      font-size: 74px;
      font-weight: 900;
      line-height: 1.25;
      letter-spacing: -2px;
      margin-bottom: 20px;
    }
    .top-title span {
      color: #38BDF8;
      text-shadow: 0 0 40px rgba(56, 189, 248, 0.4);
    }
    .top-desc {
      font-size: 34px;
      font-weight: 500;
      color: #94A3B8;
      letter-spacing: -0.5px;
    }

    .top-right-btn {
      display: flex;
      align-items: center;
      gap: 20px;
      background: #0284C7;
      color: #FFFFFF;
      padding: 36px 60px;
      border-radius: 36px;
      font-size: 42px;
      font-weight: 900;
      border: 3px solid #38BDF8;
      box-shadow: 0 20px 50px rgba(2, 132, 199, 0.4);
    }

    /* 하단 3분할 (2500 x 843) */
    .bottom-section {
      width: 100%;
      height: 843px;
      display: flex;
    }
    .bottom-col {
      flex: 1;
      height: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 60px 60px 60px 60px;
      border-right: 2px solid rgba(255, 255, 255, 0.08);
    }
    .bottom-col:last-child {
      border-right: none;
    }

    /* Btm Col 1 - 전자책 */
    .btm-1 {
      background: linear-gradient(175deg, #130E26 0%, #0A0714 100%);
    }
    /* Btm Col 2 - 웹툴 7종 */
    .btm-2 {
      background: linear-gradient(175deg, #0A1E1A 0%, #05100E 100%);
    }
    /* Btm Col 3 - 1:1 상담 */
    .btm-3 {
      background: linear-gradient(175deg, #221B05 0%, #0F0B02 100%);
    }

    .btm-badge {
      display: inline-block;
      font-size: 26px;
      font-weight: 800;
      padding: 10px 24px;
      border-radius: 9999px;
      margin-bottom: 20px;
      width: fit-content;
    }
    .btm-badge-purple { background: rgba(168, 85, 247, 0.15); color: #C084FC; border: 2px solid rgba(192, 132, 252, 0.4); }
    .btm-badge-emerald { background: rgba(16, 185, 129, 0.15); color: #34D399; border: 2px solid rgba(52, 211, 153, 0.4); }
    .btm-badge-yellow { background: rgba(254, 229, 0, 0.15); color: #FEE500; border: 2px solid rgba(254, 229, 0, 0.4); }

    .btm-title {
      font-size: 52px;
      font-weight: 900;
      line-height: 1.3;
      letter-spacing: -1px;
      margin-bottom: 12px;
    }
    .btm-desc {
      font-size: 28px;
      color: #94A3B8;
      font-weight: 500;
      line-height: 1.4;
    }

    .btm-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 90px;
      padding: 0 35px;
      border-radius: 24px;
      font-size: 32px;
      font-weight: 800;
      box-shadow: 0 15px 30px rgba(0,0,0,0.3);
    }
    .btm-btn-purple { background: #7E22CE; color: #fff; border: 2px solid #C084FC; }
    .btm-btn-emerald { background: #059669; color: #fff; border: 2px solid #34D399; }
    .btm-btn-yellow { background: #FEE500; color: #191600; border: 2px solid #fff; }
  </style>
</head>
<body>
  <!-- 상단 메인: 실시간 순위 조회 -->
  <div class="top-section">
    <div class="top-left">
      <div class="badge-live">⚡ 네이버 실시간 순위 데이터 1초 판독</div>
      <h1 class="top-title">내 매장 <span>실시간 순위 1초 무료 조회</span></h1>
      <p class="top-desc">스마트플레이스 1~20위 순위 진단 & 1위 경쟁사 핵심 분석</p>
    </div>
    <div class="top-right-btn">
      <span>지금 무료 진단하기</span>
      <span>➔</span>
    </div>
  </div>

  <!-- 하단 3개: 전자책 / 웹툴 / 1:1 상담 -->
  <div class="bottom-section">
    <!-- 하단 1: 전자책 -->
    <div class="bottom-col btm-1">
      <div>
        <div class="btm-badge btm-badge-purple">📘 2026 공략집</div>
        <h2 class="btm-title">플레이스 1위<br>비밀 전자책</h2>
        <p class="btm-desc">알고리즘 100% 해독 비법서</p>
      </div>
      <div class="btm-btn btm-btn-purple">
        <span>무료 다운</span>
        <span>➔</span>
      </div>
    </div>

    <!-- 하단 2: 무료 웹툴 7종 -->
    <div class="bottom-col btm-2">
      <div>
        <div class="btm-badge btm-badge-emerald">🛠️ 무료 웹툴 7종</div>
        <h2 class="btm-title">자영업자 필수<br>무료 마케팅 툴</h2>
        <p class="btm-desc">글자수·UTM·광고체크 등</p>
      </div>
      <div class="btm-btn btm-btn-emerald">
        <span>툴 모음 열기</span>
        <span>➔</span>
      </div>
    </div>

    <!-- 하단 3: 1:1 상담 -->
    <div class="bottom-col btm-3">
      <div>
        <div class="btm-badge btm-badge-yellow">💬 1:1 진단</div>
        <h2 class="btm-title">상위노출 1위<br>전문가 상담</h2>
        <p class="btm-desc">순위 하락 원인 맞춤 분석</p>
      </div>
      <div class="btm-btn btm-btn-yellow">
        <span>실시간 문의</span>
        <span>➔</span>
      </div>
    </div>
  </div>
</body>
</html>
`;

async function render() {
  console.log('Starting Playwright with msedge channel...');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 2500, height: 1686 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();

  // 1. 대형 3구획 렌더링
  await page.setContent(html3Split, { waitUntil: 'networkidle' });
  const path3Split = path.join(outputDir, 'kakao_richmenu_3split.png');
  await page.screenshot({ path: path3Split, type: 'png' });
  console.log('Saved 3-split rich menu to:', path3Split);

  // 2. 대형 4구획 렌더링
  await page.setContent(html4Split, { waitUntil: 'networkidle' });
  const path4Split = path.join(outputDir, 'kakao_richmenu_4split.png');
  await page.screenshot({ path: path4Split, type: 'png' });
  console.log('Saved 4-split rich menu to:', path4Split);

  await browser.close();
  console.log('Rendering completed successfully!');
}

render().catch(err => {
  console.error('Rendering error:', err);
  process.exit(1);
});
