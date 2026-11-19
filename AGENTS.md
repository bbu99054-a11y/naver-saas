<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# PostSync 에이전트 마스터 헌법 (2026)

> **적용 대상:** Next.js 16 풀스택 · 마이크로 웹툴 · SEO/GEO 자동화 작업 전체 (2026년 표준)

---

## 제1조. 기본 원칙
* **로컬 빌드 검증:** 코드 변경 작업 완료 전 반드시 `npm run build`를 실행해 컴파일·타입 에러 0건을 확인합니다.
* **Read Before Write:** 가상의 함수나 파라미터를 지어내지 말고, 수정 전 대상 파일과 실제 스키마를 직접 읽습니다.
* **실전 오답노트 숙지:** 작업 시작 전 [.agent/EXPERIENCE.md](file:///c:/workspace/postsync/.agent/EXPERIENCE.md)를 확인해 동일 버그를 반복하지 않습니다.

---

## 제2조. 절대 금지 (위반 시 즉시 중단)
1. **시크릿 노출 금지:** API 키·DB 접속 문자열·토큰을 코드에 하드코딩하거나 `NEXT_PUBLIC_` 환경변수에 포함하지 않습니다. 모든 시크릿은 `.env.local`로만 관리합니다.
2. **무단 Git 푸시 금지:** 대표님이 명시적으로 푸시를 지시하거나 텔레그램 푸시 결재 승인이 완료된 경우에만 `git push`를 실행합니다.
3. **정밀 최소 수정:** 정상 동작 코드를 임의로 전면 재작성하지 않고 필요한 영역만 수정하며, 사전 설명·승인 없이 신규 패키지를 설치하지 않습니다.
4. **에러 은폐 · 게으른 코드 금지:** `any` 날림 처리, 주석 처리, 기능 삭제, `// TODO`·껍데기 모킹을 금지합니다.

---

## 제3조. 사전 승인 및 구현계획서 (`implementation_plan.md`)
1. **작성 대상:** 신규 기능 추가 · 아키텍처/DB 구조 변경 · 3개 이상 파일 수정 · 리팩토링 시 채팅 텍스트 대신 `implementation_plan.md` 아티팩트(`RequestFeedback: true`)를 먼저 제시합니다.
   * *예외:* 단순 조회 · 데이터 스냅샷 저장 · 1~2줄 오타 수정 · 텔레그램 결재로 대체되는 무인 스케줄 실행 · 읽기 전용 Plan Mode.
2. **필수 6대 형식:** ① 🎯 해결되는 점 ② 👁️ UI 변경 사항 ③ ⚙️ 시스템 동작 원리 ④ 📁 수정 대상 파일 목록 ⑤ ⚠️ 위험 요소/부작용 ⑥ 📉 플랜 진행 시 단점/트레이드오프.
3. **패키지 · DB 변경:** 신규 `npm install` 및 데이터 유실 위험이 있는 스키마 변경은 사전 설명 후 승인받아 진행합니다.

---

## 제4조. Next.js 16 & 클린 코드 표준
* **RSC 기본:** 페이지·컴포넌트는 기본 Server Component로 두고, `'use client'`는 브라우저 상태·이벤트가 필요한 최말단에만 선언합니다.
* **입력 검증 & 캐시:** Server Actions 및 `route.ts` 입력값은 **Zod**로 검증하고 변경 후 `revalidatePath()`/`revalidateTag()`를 호출합니다.
* **TypeScript:** `enum` 대신 `as const` 리터럴 객체를 쓰고, 배럴 파일(`index.ts`) 남발을 금지합니다.

---

## 제5조. 토큰 다이어트 · 금지어 · 냉정한 평가
* **토큰 절약:** 대용량 파일 전체를 반복 읽기/덤프하지 않고 행 범위로 읽고 `edit_file`로 최소 diff만 수정하며, 리서치 서브에이전트는 `flash`/`flash_lite`를 우선 사용합니다.
* **금지 용어 및 부호:** 아래 단어·부호는 코드 카피와 설명을 포함해 일체 금지합니다.
  * `'격차'` 금지 ➔ `차이`, `부족분`, `비교 분석`, `정량 대조`, `갭` 사용
  * `'타래'` / `'타래글'` 금지 ➔ `(이어지는 글 👇)`, `스레드 연재` 사용
  * `'래퍼'` / `'AI 래퍼'` 금지 ➔ `단순 AI 껍데기 서비스`, `단순 API 연동 툴` 사용
  * 영문 엠대시 금지 ➔ 한국어 가운뎃점(`·`) 사용
* **냉정한 평가 (칭찬·아첨 금지):** "대단하십니다", "완벽합니다" 같은 의례적 칭찬이나 무조건적 동조를 금지합니다. 숨은 맹점 · 기술적 부채 · 운영 리스크를 팩트 기반으로 직설 지적하고 현실적 대안을 제시합니다.

---

## 제6조. 작업별 온디맨드 참조 가이드
* **블로그 · 칼럼 · SEO/GEO 콘텐츠 집필 및 수정:** 반드시 [docs/SEO_GEO_AEO_CONTENT_WRITING_GUIDE_2026.md](file:///c:/workspace/postsync/docs/SEO_GEO_AEO_CONTENT_WRITING_GUIDE_2026.md)를 먼저 읽고 분량(1,800~2,600자 / 심층 2,800~4,000자) · 두괄식 · 목적별 문체 분리 · AI 흔적 제거 · 내부툴 CTA · JSON-LD 기준을 따릅니다.
* **프론트엔드 CSS 조판 · UI 카피라이팅 · 접근성 작업:** 반드시 [.agent/UI_STYLE_GUIDE.md](file:///c:/workspace/postsync/.agent/UI_STYLE_GUIDE.md)를 먼저 읽고 `keep-all` · `text-wrap` · `38rem` 너비 · 단위 없는 행간 · 버튼/모달 `[닫기]` · 320px/200% 접근성 기준을 따릅니다.
