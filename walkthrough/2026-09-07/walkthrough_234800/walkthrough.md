# 📋 워크스루: 네이버 블로그 목표 글자수 공식 수정 완료

대표님의 승인에 따라 **다른 기능은 일체 손대지 않고**, 목표 글자수 계산 공식에서 **+300자 추가 로직을 제거**하고 **최소 보장 글자수를 2,300자**로 깔끔하게 조정 완료했습니다.

---

## 🛠️ 수정 내역 (Changes Made)

### 1. [src/lib/scraper.ts](file:///c:/workspace/naver_SaaS_Copy_For_USB/src/lib/scraper.ts#L160-L164)
- **수정 전:** `recommendedTextLength: Math.max(avgLength + 300, 2500)`
- **수정 후:** `recommendedTextLength: Math.max(avgLength, 2300)`
- 상위 블로그 평균에 무조건 300자를 더하던 부분을 삭제하고, 최소 보장 글자수를 2,300자로 변경했습니다.

### 2. [src/app/api/generate-seo/route.ts](file:///c:/workspace/naver_SaaS_Copy_For_USB/src/app/api/generate-seo/route.ts#L294-L300)
- **L297 (SERP 프롬프트 지침):**
  - 기존: `상위 경쟁사 평균(${serpData.averageTextLength}자)보다 300자 더 길고 풍부한 약 ${serpData.recommendedTextLength}자 내외로 작성해.`
  - 변경: `상위 경쟁사 평균(${serpData.averageTextLength}자) 수준의 약 ${serpData.recommendedTextLength}자 내외로 작성해.`
- **L437 (SERP 수집 실패 시 Fallback 기본값):**
  - 기존: `약 ${serpData?.recommendedTextLength || 2800}자`
  - 변경: `약 ${serpData?.recommendedTextLength || 2300}자`

### 3. [src/app/dashboard/guide/page.tsx](file:///c:/workspace/naver_SaaS_Copy_For_USB/src/app/dashboard/guide/page.tsx#L577-L579)
- 가이드 UI 안내 문구 동기화:
  - 기존: *"경쟁사보다 300자 더 풍부한 완성형 원고"*
  - 변경: *"경쟁사 수준(최소 2,300자 보장)의 완성형 원고"*

---

## 🔍 자율 검증 결과 (Verification Results)

1. **단위 공식 연산 테스트 (`verify_formula.js`):**
   - 상위 평균 1,500자 ➡️ 2,300자 (최소 2,300자 보장 확인)
   - 상위 평균 2,200자 ➡️ 2,300자 (최소 2,300자 보장 확인)
   - 상위 평균 2,600자 ➡️ 2,600자 (+300자 추가 없이 상위 수준 유지 확인)
   - 상위 평균 3,100자 ➡️ 3,100자 (+300자 추가 없이 상위 수준 유지 확인)

2. **TypeScript 타입 검사 (`tsc --noEmit`):**
   - **통과 (오류 0건)**

3. **로컬 프로덕션 빌드 (`npm run build`):**
   - Turbopack 컴파일 성공 (19.5s)
   - 모든 앱 라우트(Static 및 Dynamic) 정상 생성 확인
   - **빌드 성공 (Exit Code 0)**
