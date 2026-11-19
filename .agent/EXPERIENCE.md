# 🧠 PostSync 에이전트 실전 오답노트 (Living Memory)

> **이 문서의 목적:**  
> 사람이 일일이 반복해서 지시하거나 같은 문제를 두 번 겪지 않도록, PostSync 프로젝트를 구축·운영하며 겪었던 실제 에러, 기술적 맹점, API 규격 함정 및 해결책을 기록하는 영구 기억 저장소입니다.  
> 모든 AI 에이전트는 작업 시작 전 본 문서를 숙지하여 동일한 실수를 절대 반복하지 않습니다.

---

## 📌 Lesson 01: 구글 클라우드 조직 정책(`iam.disableServiceAccountKeyCreation`) 차단 해결법
- **증상:** Google Cloud Console에서 서비스 계정 생성 후 `[새 키 만들기]` 클릭 시 *"조직에 서비스 계정 키 생성을 차단하는 조직 정책이 적용되었습니다 (iam.disableServiceAccountKeyCreation)"* 에러 발생.
- **원인:** 2024년 이후 구글 클라우드가 기업/도메인 조직(Google Workspace 연동 계정)에 'Secure-by-default' 정책을 기본 강제함. 프로젝트 단위에서는 상위 조직 정책을 수정할 수 없어 `[정책 관리]` 버튼이 비활성화됨.
- **해결책:**
  1. 최상단 리소스 선택기에서 프로젝트가 아닌 **최상위 조직(`bbu99054-org` 등)**을 직접 선택.
  2. **[IAM 및 관리자] ➔ [IAM]**에서 본인 계정에 **`조직 정책 관리자 (roles/orgpolicy.policyAdmin)`** 역할을 셀프로 부여 후 저장.
  3. **[조직 정책]** 메뉴 ➔ `iam.disableServiceAccountKeyCreation` 검색 ➔ 활성화된 `[정책 관리]` 클릭 ➔ 규칙을 **'미시행(사용 안함 / Not enforced)'**으로 변경 후 저장.
  4. 다시 원래 프로젝트로 돌아와 키를 생성하면 1초 만에 정상 다운로드됨.

---

## 📌 Lesson 02: 서비스 계정 키 파일 Git 유출 방지 및 배포 환경 이원화
- **증상:** 다운로드된 구글 서비스 계정 키 파일(`postsync-api-*.json`)이 Git에 커밋될 경우 깃허브 공개 시 구글이 키를 즉시 폐기(Revoke)해버림.
- **해결책:**
  1. `.gitignore`에 반드시 키 파일 패턴 사전 등록:
     ```gitignore
     postsync-api-*.json
     *.credentials.json
     *gserviceaccount*.json
     ```
  2. 서버 코드([auth.ts](file:///c:/workspace/postsync/src/lib/google/auth.ts))는 로컬에서는 키 파일을 읽고, Vercel 등 배포 환경에서는 환경변수(`GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`)를 읽도록 **듀얼 인증 폴백** 구조를 구축할 것.

---

## 📌 Lesson 03: 구글 서치콘솔 API vs GA4 Data API 날짜 포맷 함정
- **증상:** 서치콘솔 API(`searchanalytics.query`)에 GA4 스타일의 상대 날짜(`5daysAgo`, `yesterday`)를 전달하면 `'5daysAgo' is not a valid date string` 400 에러 발생.
- **원인 및 규격 차이:**
  - **GA4 Data API:** `yesterday`, `7daysAgo` 등 상대적 문자열 파라미터 완벽 지원.
  - **구글 서치콘솔 API:** 무조건 엄격한 **`YYYY-MM-DD`** 포맷(예: `2026-11-05`)만 수용함.
- **해결책:**
  ```javascript
  const today = new Date();
  const pastDate = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
  const startDate = pastDate.toISOString().split("T")[0]; // YYYY-MM-DD
  const endDate = today.toISOString().split("T")[0];
  ```

---

## 📌 Lesson 04: 네이버 서치어드바이저 통계 API 부재 및 IndexNow 표준 전환
- **팩트:** 네이버 서치어드바이저는 구글 서치콘솔처럼 노출수/클릭수/순위/CTR 데이터를 외부 서버로 가져오는 **공식 통계 REST API를 제공하지 않음.**
- **구분 및 대응:**
  - **노출/순위 통계:** 네이버 서치어드바이저 웹 화면(`searchadvisor.naver.com`)에서 직접 확인해 [src/data/naver-latest.json](file:///c:/workspace/postsync/src/data/naver-latest.json)에 스냅샷으로 저장.
  - **즉시 수집 요청:** 일반 웹용 구형 네이버 신디케이션 v2 API는 축소·종료되었으므로 더 이상 사용하지 않으며, 공식 지원 프로토콜인 **IndexNow**(`https://searchadvisor.naver.com/indexnow`, [ping_indexnow.js](file:///c:/workspace/postsync/scripts/ping_indexnow.js))를 사용할 것.

---

## 📌 Lesson 05: Next.js 16 Turbopack 동적 파일 접근 번들 경고
- **증상:** `path.resolve(process.cwd(), filename)` 사용 시 Turbopack 빌드 과정에서 *"Dynamic filesystem access causes tracing of the whole project"* 경고 발생 (서버 번들 비대화 위험).
- **해결책:**
  ```typescript
  // /*turbopackIgnore: true*/ 인라인 주석 추가로 번들러 정적 추적 예외 처리
  const localKeyPath = path.resolve(/*turbopackIgnore: true*/ process.cwd(), localKeyFilename);
  ```

---

## 📌 Lesson 06: GA4 Data API TypeScript 타입 매핑 오버로드 에러
- **증상:** GA4 API 호출 시 `limit: 5`를 숫자로 전달하면 TypeScript 오버로드 에러 발생 (`Type 'number' is not assignable to type 'string'`).
- **해결책:** Google Analytics Data API의 타입 정의에서 `limit`은 문자열로 선언되어 있으므로 반드시 **`limit: "5"`** 또는 `as any` 캐스팅 처리할 것.

---

## 📌 Lesson 07: 텔레그램 Bot API HTML 파싱 규격
- **증상:** 텔레그램 메시지 발송 시 `parse_mode: 'HTML'` 상태에서 본문에 닫히지 않은 `<` 또는 지원하지 않는 HTML 태그가 들어가면 파싱 실패 에러(400 Bad Request) 발생.
- **해결책:**
  - 텔레그램 공식 지원 태그만 사용: `<b>`, `<i>`, `<code>`, `<pre>`, `<a href="...">`.
  - 모든 동적 문자열(검색어 · URL · 유입 채널 · 사유)은 반드시 `escapeHtml()` 처리 후 삽입.

---

## 📌 Lesson 08: 이중 스케줄러 실행 및 GitHub Actions UTC 자정 정각 큐 지연
- **증상:** 로컬 Antigravity Sidecar(오전 9시 KST)와 GitHub Actions(`cron: '0 0 * * *'`)가 동시에 켜져 있으면 하루 2번 알람이 오고, GitHub Actions는 UTC 00:00 글로벌 배치 피크 때문에 **4~5시간 큐 지연**(오후 1~2시경 실행)이 발생함.
- **해결책:** 일일 SEO 배치는 로컬 Sidecar(`daily-seo-engine`) 단일화로 운영하고, [daily_metrics_telegram.yml](file:///c:/workspace/postsync/.github/workflows/daily_metrics_telegram.yml)의 `schedule:`은 주석 처리해 수동 실행(`workflow_dispatch`) 전용으로 유지할 것.

---

## 📌 Lesson 09: 네이버 서치어드바이저 Chrome SPA 다중 사이트 혼입 함정
- **증상:** 브라우저에 `paytaxhub.com` 등 다른 사이트가 열린 서치어드바이저 탭이 있을 때 URL 쿼리만 바꾼다고 사이드바 메뉴나 데이터가 즉시 동기화되지 않을 수 있고, 기존 탭을 변형하면 사용자 작업 흐름이 깨짐.
- **해결책:** 기존 탭은 건드리지 말고 반드시 `new_page`로 `?site=https%3A%2F%2Fwww.postsyncapp.com`을 열어 화면 상단 활성 도메인이 `https://www.postsyncapp.com`인지 검증한 뒤 수집하고, 완료 즉시 임시 탭만 `close_page`로 정리할 것.

---

## 📌 Lesson 10: GSC · 텔레그램 배치 4대 실전 함정 (KST · 정렬 · 3일 지연 · 오프셋)
- **증상:**
  1. `toISOString().split("T")[0]`는 UTC 기준이라 오전 9시 이전 실행 시 전날 날짜로 기록됨.
  2. GSC API는 클릭 0건 구간을 **알파벳순**으로 반환하므로 `rowLimit: 4`만 조회하면 상위 노출 검색어가 누락됨.
  3. GSC 최근 1~2일은 미확정 데이터여서 `-1일` 기준으로 비교하면 `CASE_5` 가짜 급락 오탐이 발생함.
  4. 텔레그램 `getUpdates?limit=5`는 6건 이상 미처리 메시지가 쌓여 있으면 과거 `"승인"`/`"ok"`를 읽어 무인 자동 승인 위험이 있음.
- **해결책:** 모든 자동화 스크립트는 [scripts/lib/common.js](file:///c:/workspace/postsync/scripts/lib/common.js)의 `getKstYmd()`, `getLatestTelegramOffset()`(`offset=-1&limit=1`)을 사용하고, GSC 조회는 충분한 `rowLimit` 후 노출 내림차순 정렬 · `-3일` 기준 대칭 14일 비교를 적용할 것.
