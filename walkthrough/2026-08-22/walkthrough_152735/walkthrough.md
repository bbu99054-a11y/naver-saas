# 🎨 본문 인포그래픽 카드 3종(Q&A, 리스크 경고, Before/After 비교) 공간 채움 및 디자인 최적화 완료 보고서

## 📌 작업 개요
* **목표:**
  1. **[6번 Q&A 문답 카드]:** 상단 질문과 하단 답변 사이의 어색한 300px 공백을 완전히 제거하고, 답변 폰트를 **`32px Bold`로 대형화**하며 하단에 실무 조언 풋터를 추가해 브리핑 카드처럼 꽉 찬 레이아웃으로 개편.
  2. **[7번 골든타임 리스크 경고 카드]:** 중앙 공백을 제거하고 **`[🚨 상단 긴급 경고 뱃지]` ➡️ `[⚠️ 중앙 핵심 불이익 대형 박스 (32px Bold)]` ➡️ `[💡 하단 전문가 선제 방어 가이드]`**의 3단계 긴급 시스템 구축.
  3. **[3번 Before vs After 비교 카드]:** 좌측(잘못된 대처 - 로즈 레드) vs 우측(전문가 솔루션 - 에메랄드 그린)의 **명도 대비를 선명하게 극대화**하고, 불릿 폰트를 `24px Bold`로 확대.
  4. 3종 카드 모두 **`1.5px` 슬림 모던 외곽선**으로 통일.
* **원칙 준수:**
  * **글쓰기 AI 코어 엔진(`[ZONE-6]`: `src/app/api/generate-seo/route.ts`)은 단 1줄도 수정하지 않고 100% 무변경 유지**.

---

## 🛠️ 세부 변경 내역

### 1. [`procedural-generator.tsx`](file:///c:/workspace/naver_SaaS_Copy_For_USB/src/lib/image-engine/procedural-generator.tsx)
* **`QnaTemplate` (6번):**
  * 상단 Q 질문 카드 + 하단 `flex: 1` 대형 A 답변 카드(32px Bold) + 하단 조언 풋터 구조로 빈 공간 완전 제거.
* **`WarningTemplate` (7번):**
  * 상단 긴급 경고 헤더(골든타임 뱃지) + 중앙 `flex: 1` 리스크 박스(32px Bold) + 하단 방어 가이드 풋터의 3단 긴급 시스템 적용.
* **`ComparisonTemplate` (3번):**
  * 좌우 배경/텍스트 명도 대비 극대화 (`#FFF1F2` 로즈 vs `#F0FDF4` 에메랄드).
  * 불릿 폰트 `24px Bold` 대형화 및 `1.5px` 슬림 외곽선 적용.

---

## 🧪 검증 결과
* **Next.js 프로덕션 빌드:** `cmd.exe /c "npm run build"` ➡️ **Exit Code 0 (컴파일 100% 성공)**
* **글쓰기 엔진 보존:** `src/app/api/generate-seo/route.ts` 0줄 변경 확인.
