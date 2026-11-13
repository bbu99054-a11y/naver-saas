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

## 📌 Lesson 04: 네이버 서치어드바이저는 통계 조회 공식 REST API가 없음
- **팩트:** 네이버 서치어드바이저는 구글 서치콘솔처럼 노출수/클릭수/순위/CTR 데이터를 외부 서버로 가져오는 **공식 통계 REST API를 제공하지 않음.**
- **구분 및 대응:**
  - 노출/순위 통계: 네이버 서치어드바이저 웹 화면(`searchadvisor.naver.com`)에서 눈으로 확인해야 함.
  - 공식 지원 유일 API: 새 글 발행 시 네이버 검색 봇을 즉시 호출하는 **'네이버 신디케이션(수집 핑) v2 API'**만 연동 가능 ([syndication.ts](file:///c:/workspace/postsync/src/lib/naver/syndication.ts)).

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
  - 일반 본문은 군더더기 없이 줄바꿈과 이모지, 볼드 태그로만 정갈하게 구성.
