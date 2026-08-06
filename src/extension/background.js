// background.js

// background.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "PUBLISH_TO_NAVER") {
    const { title, content, naverId } = request.payload;
    
    // 프론트엔드에서 받은 네이버 아이디를 사용합니다.
    const writeUrl = naverId 
      ? `https://blog.naver.com/${naverId}/postwrite` 
      : "https://blog.naver.com/PostWriteForm.naver";
      
    console.log("Navigating to:", writeUrl);
      
    chrome.tabs.create({ url: writeUrl }, function(tab) {
      if (tab && tab.id) {
        // 탭이 완전히 로드될 때까지 기다렸다가 메시지를 보냅니다.
        setTimeout(() => {
          chrome.tabs.sendMessage(tab.id, {
            action: "INJECT_AND_PUBLISH",
            payload: { title, content }
          });
        }, 6000); // 스마트에디터 렌더링 대기 시간
      }
    });
      
    sendResponse({ success: true, message: "Publish process started" });
  }
  return true;
});
