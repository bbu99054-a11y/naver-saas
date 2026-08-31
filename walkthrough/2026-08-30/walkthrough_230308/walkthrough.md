# 🏆 인포그래픽 카드 벤토 그리드 글쓰기 멈춤·무한루프 원천 해결 완료 보고서

## 📌 작업 개요
* **문제:** 벤토 그리드 개편(`4268314`) 후 SaaS 글쓰기(`/dashboard/write`)에서 AI가 글을 작성하다가 인포그래픽 카드 위치에서 글 작성이 멈추고 무한루프/먹통에 빠지던 현상.
* **조치 내용:**
  1. **[ZONE-6] `src/lib/cardImageUploader.ts`**:
     * `emptyImgRegex`를 태그 경계를 절대 넘지 않는 단일 태그 안전 정규식(`/<img([^>]*?)src=(["'])([^"'<>]*?)\2([^>]*?)>/gi`)으로 정밀 수정하여 본문 증발 버그 원천 차단.
     * `isInvalidSrc`의 괄호 연산자 우선순위를 안전하게 수정.
  2. **[ZONE-4] `src/app/dashboard/write/page.tsx`**:
     * 스트리밍 중 닫히지 않은 미완성 `<img ...` 태그가 뒷 문단을 망가뜨리지 않도록 정밀 임시 숨김 가드(`clean.replace(/<img\b(?![^<]*>)[^<]*/gi, '')`) 장착.
     * SVG Data-URI 정규식의 다중 태그 침범 방지 (`[^"']*?`).
     * `useEffect([completion])`의 `setPostTitle` 중복 `setState` 루프 제거.
     * `preUploadCardImages`가 스트리밍 도중 불필요하게 상태를 흔들지 않고 완료 시점에만 1회 실행되도록 안전 가드 보강.
  3. **[ZONE-4] `src/lib/templates.ts`**:
     * 12종 벤토 카드 템플릿의 `<img>` 태그에서 130자짜리 무거운 인라인 `style="..."` 코드를 모두 제거하고 초경량 `<img src="..." alt="..." />`로 최적화. (스타일은 프론트엔드와 uploader에서 자동 주입)
  4. **[ZONE-3] `src/app/api/generate-seo/route.ts`**:
     * 프롬프트 템플릿 예시를 초경량 태그로 동기화하고 불필요한 `frequencyPenalty` 제거.

---

## 🛠️ 수정 내역 상세

| 영역 (Zone) | 파일 경로 | 주요 수정 내용 |
| :--- | :--- | :--- |
| **[ZONE-6]** Image Uploader | `src/lib/cardImageUploader.ts` | `emptyImgRegex` 단일 태그 한정 정규식(`[^"'<>]*?`) 수정 & `isInvalidSrc` 연산자 안전화 |
| **[ZONE-4]** UI Previewer | `src/app/dashboard/write/page.tsx` | 미완성 태그 렌더 가드 장착 & `setPostTitle` / `preUploadCardImages` 렌더링 폭풍 방지 |
| **[ZONE-4]** Visual Templates | `src/lib/templates.ts` | 12종 벤토 카드 태그 내 `style="..."` 제거 (태그 길이 250자 ➔ 70자로 3배 다이어트) |
| **[ZONE-3]** AI Pipeline | `src/app/api/generate-seo/route.ts` | 프롬프트 내 카드 태그 예시 초경량화 동기화 & `frequencyPenalty` 정리 |

---

## 🔍 자율 검증 결과

1. **독립 단위 테스트 (`scratch/verify_fix.ts`):**
   * 미완성 태그 스트리밍 시 본문 1, 2 보존 여부: **100% PASS** (본문 증발 0건)
   * 완성형 벤토 카드 URL 및 480px 표준 인라인 스타일 자동 주입: **100% PASS**
2. **TypeScript 타입 검증 (`npx tsc --noEmit`):**
   * 에러 0건 (Exit Code: 0) 완벽 통과.
3. **Next.js 프로덕션 빌드 검증 (`npm run build`):**
   * Turbopack 컴파일 성공 (18개 정적 페이지 및 동적 API 라우트 100% 정상 빌드).
