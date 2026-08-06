// content.js

// 1. SaaS 웹앱에서 보내는 메시지를 수신하여 백그라운드로 전달
window.addEventListener("message", (event) => {
  // 보안 검사: 허용된 출처인지 확인 (여기서는 로컬호스트나 vercel)
  if (event.source !== window) return;

  if (event.data.type && (event.data.type === "FROM_SAAS_PUBLISH")) {
    chrome.runtime.sendMessage({
      action: "PUBLISH_TO_NAVER",
      payload: event.data.payload
    }, (response) => {
      console.log("Extension background responded:", response);
    });
  }
});

// 2. 백그라운드에서 보내는 발행 명령 수신 (네이버 탭에서 동작)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "INJECT_AND_PUBLISH") {
    console.log("Received publish payload:", request.payload);
    
    const { title, content } = request.payload;
    let attempts = 0;
    
    // 네이버 에디터 DOM이 렌더링될 때까지 0.5초 간격으로 최대 20번(10초) 재시도합니다.
    const tryInject = setInterval(() => {
      attempts++;
      
      // 제목 요소 찾기 (스마트에디터 ONE의 대표적인 클래스들)
      const titleEls = document.querySelectorAll(".se-documentTitle, .se-title-text, .se-ff-nanumgothic");
      // 본문 영역 찾기
      const contentEls = document.querySelectorAll(".se-main-container, .se-component-content, .se-text-paragraph");
      
      if (titleEls.length > 0 && contentEls.length > 0) {
        clearInterval(tryInject);
        console.log("Found Naver Editor DOM! Injecting...");
        
        try {
          // 1. 제목 입력
          const titleEl = titleEls[0];
          titleEl.focus();
          titleEl.textContent = title;
          titleEl.dispatchEvent(new Event('input', { bubbles: true }));
          
          // 2. 본문 입력
          // 가장 정확한 contenteditable 요소를 찾습니다.
          let contentEditableEl = document.querySelector(".se-main-container [contenteditable='true']");
          if (!contentEditableEl) {
             contentEditableEl = document.querySelector(".se-text-paragraph") || document.querySelector(".se-component-content");
          }
          
          if (contentEditableEl) {
            contentEditableEl.focus();
            
            // 시도 1: 브라우저 클립보드 API를 사용해 사용자 클립보드에 HTML 원고를 복사해둡니다 (가장 안전한 2026년형 대비책)
            try {
              const blobHtml = new Blob([content], { type: "text/html" });
              const blobText = new Blob(["HTML 원고"], { type: "text/plain" });
              const data = [new ClipboardItem({ "text/html": blobHtml, "text/plain": blobText })];
              navigator.clipboard.write(data).catch(err => console.log("Clipboard write failed:", err));
            } catch (e) {
              console.log("Clipboard API error:", e);
            }

            // 시도 2: 강제 innerHTML 주입 후 리액트/프로즈미러(ProseMirror) 상태 동기화 이벤트 발생
            contentEditableEl.innerHTML = content;
            
            // 스마트에디터가 강제로 바뀐 DOM을 인식하도록 각종 이벤트 폭격
            contentEditableEl.dispatchEvent(new Event('input', { bubbles: true }));
            contentEditableEl.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Enter' }));
            contentEditableEl.dispatchEvent(new Event('change', { bubbles: true }));
            contentEditableEl.dispatchEvent(new Event('blur', { bubbles: true }));
            
            // 추가로 execCommand 시도
            document.execCommand('insertHTML', false, content);
            
            // 시도 3: Synthetic Paste Event
            const dataTransfer = new DataTransfer();
            dataTransfer.setData('text/html', content);
            dataTransfer.setData('text/plain', "HTML 본문");
            
            const pasteEvent = new ClipboardEvent('paste', {
              clipboardData: dataTransfer,
              bubbles: true,
              cancelable: true,
              composed: true
            });
            contentEditableEl.dispatchEvent(pasteEvent);
          }
          
          // 사용자에게 안내 메시지 (만약 돔 주입이 막혔을 경우 대비)
          const toast = document.createElement("div");
          toast.innerHTML = "✅ AI 원고가 준비되었습니다! <br>본문에 아무것도 없다면 <b>[Ctrl + V]</b>를 눌러주세요.";
          toast.style.cssText = "position:fixed; bottom:30px; left:50%; transform:translateX(-50%); background:#03c75a; color:white; padding:15px 25px; border-radius:30px; font-weight:bold; font-size:16px; z-index:999999; box-shadow:0 10px 20px rgba(0,0,0,0.2); text-align:center; animation: fadeInOut 5s forwards;";
          document.body.appendChild(toast);
          
          // 애니메이션 스타일 추가
          if (!document.getElementById("toast-style")) {
             const style = document.createElement("style");
             style.id = "toast-style";
             style.innerHTML = "@keyframes fadeInOut { 0% { opacity:0; transform:translate(-50%, 20px); } 10% { opacity:1; transform:translate(-50%, 0); } 90% { opacity:1; transform:translate(-50%, 0); } 100% { opacity:0; transform:translate(-50%, -20px); } }";
             document.head.appendChild(style);
          }
          
          // 3. 자동 발행 클릭 (붙여넣기 렌더링 후 약간의 딜레이 필요)
          setTimeout(() => {
            const publishBtn = document.querySelector(".btn_publish, .publish_btn");
            if (publishBtn) {
              publishBtn.click();
              
              // 최종 확인 버튼
              setTimeout(() => {
                const confirmBtn = document.querySelector(".btn_confirm");
                if (confirmBtn) confirmBtn.click();
              }, 1500);
            }
          }, 3000);
          
        } catch (error) {
          console.error("DOM Injection failed:", error);
        }
      } else if (attempts >= 20) {
        clearInterval(tryInject);
        console.error("Naver Editor DOM not found after 10 seconds.");
      }
    }, 500);
    
    sendResponse({ success: true });
  }
  return true;
});

// 웹앱 측에 익스텐션이 설치되어 있음을 알리기 위한 flag
const extensionMarker = document.createElement("div");
extensionMarker.id = "seo-affiliate-extension-installed";
extensionMarker.style.display = "none";
document.body.appendChild(extensionMarker);
