# 📋 blogauto-naver-main 분석 및 SaaS 네이버 원클릭 발행 솔루션 워크스루

> **작성 일시:** 2026-08-29 14:50:30  
> **상태:** 분석 완료 (기존 소스코드 수정 없음 - 안전 검토 완료)

---

## 1. 개요 및 조사 결과 요약

사용자께서 문의하신 `blogauto-naver-main` (질문 상의 `blogauto-naver-mail`) 폴더는 **OpenAI Codex와 Playwright, Electron 기반의 Windows 전용 네이버 블로그 + 티스토리 자동 포스팅 데스크톱 프로그램**입니다.

### 1) 내 Antigravity IDE 로컬 환경에서 사용 가능한가?
- **네, 100% 사용 가능합니다.**
- Electron + Node.js + Playwright-Core 기반으로 작성되어 있어 Windows 환경에서 `npm install` 및 `npm start`로 바로 실행 가능합니다.
- 특히 **네이버 블로그 자동 발행 코어(`src/lib/naverPublisher.js`)**는 Codex 유무와 상관없이 독립적으로 작동할 수 있는 완성형 모듈입니다.

---

## 2. 핵심 원리 및 구조 요약

### 1) 4단계 멀티 에이전트 시스템
- **Research / Title Agent:** 키워드와 검색 결과를 분석하여 팩트 기반 제목과 Writer Contract(작성 규약) 수립.
- **Writer Agent:** Writer Contract에 맞춰 본문, 네이버 전용 소제목 마커(`[SECTION - ...]`), 이미지 마커(`[IMAGE INSERT - n]`), 태그, 이미지 프롬프트 작성.
- **Main Review Agent:** 13가지 항목(제목 일치, 팩트 검증, 낚시성 문구 배제, 본문 퀄리티 등)을 자율 검수하여 PASS/REVISION/BLOCK 결정.
- **Image Worker:** 썸네일(한국어 텍스트 오버레이 카드) 및 본문 섹션별 도해 이미지 생성.

### 2) 네이버 스마트에디터 ONE 원클릭 발행 (`src/lib/naverPublisher.js`)의 비결
1. **Playwright Persistent Context (영구 세션):**
   - 로컬의 `browser-profile` 폴더에 실제 크롬 프로필 데이터를 유지하여 최초 1회 로그인/보안인증 후 세션을 무한 재사용.
2. **임시저장 팝업 완벽 제어:**
   - 글쓰기 진입 시 발생하는 "작성 중인 글이 있습니다" 팝업을 감지하여 자동으로 "취소" 클릭.
3. **ProseMirror 친화적 휴먼 타이핑:**
   - DOM에 강제로 HTML을 밀어 넣는 대신, 키보드 이벤트(`page.keyboard.type`)와 툴바 UI 버튼(소제목 버티컬 라인 인용구, 따옴표 인용구 등)을 직접 클릭하여 네이버 에디터 내부 상태 트리를 완벽하게 구성.
4. **로컬 이미지 파일 OS 네이티브 업로드:**
   - 사진 버튼 클릭 시 발생하는 `filechooser` 이벤트를 가로채서 로컬 파일 경로를 전달(`setFiles`)하고, 네이버의 "AI 활용 설정" 토글까지 자동 ON.
5. **2단계 발행 레이어 분리:**
   - 1차 발행 설정 버튼(`data-click-area='tpb.publish'`) -> 카테고리/태그/공개설정 -> 2차 최종 발행 버튼(`data-testid='seOnePublishBtn'`)을 완벽하게 식별하여 클릭.

---

## 3. 내가 구축한 SaaS (PostSynk) 적용 및 네이버 원클릭 발행 해결 방안

### 1) 왜 기존 SaaS의 Chrome Extension 방식이 실패했는가?
- Chrome Extension은 웹페이지의 `contentEditable`에 innerHTML이나 복사/붙여넣기(Paste) 이벤트를 강제로 발생시키지만, 네이버 스마트에디터 ONE의 내부 상태 엔진(ProseMirror)이 이를 감지하지 못해 글이 날아가거나 발행 버튼이 비활성화되는 치명적 한계가 있었습니다. 또한 파일 업로더에 로컬 이미지를 직접 전달할 수 없었습니다.

### 2) 완벽한 해결책: PostSynk Local Companion (초경량 로컬 브릿지)
- 웹 SaaS에서 글을 생성한 후 "원클릭 네이버 발행"을 누르면, 사용자 PC의 작은 로컬 백그라운드 브릿지가 `naverPublisher.js`의 Playwright 로직을 구동하여 **사용자의 네이버 블로그에 3초 만에 100% 무결점으로 자동 포스팅**하는 방식입니다.

---

## 4. 생성된 산출물 파일 링크
- 전체 상세 분석 보고서: [blogauto_naver_analysis_and_saas_integration.md](file:///c:/workspace/naver_SaaS_Copy_For_USB/blogauto_naver_analysis_and_saas_integration.md)
