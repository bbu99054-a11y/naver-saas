# 🚀 구독 모델별 & 기능별 최신 LLM AI 모델 라우팅 설정 완료

## 📌 작업 개요
- **목적:** 전문직 SEO 원고 생성 엔진 및 10대 추천 키워드 발굴기의 호출 LLM 모델을 요청하신 최신 규격(Pro: `gpt-5.6-terra`, Free/Basic: `gemini-3.7-flash`, Keyword: `gemini-3.7-flash`)으로 정밀 업데이트
- **작업 일시:** 2026-08-20
- **관련 구역:** `[ZONE-6]` 글쓰기 코어 엔진, `[ZONE-1]` / `[ZONE-8]` 큐레이션 및 대시보드 로직

---

## 🛠️ 수정 상세 내역

### 1. 전문직 SEO 원고 생성 엔진 (`src/app/api/generate-seo/route.ts`)
- **유료 Pro / Premium 회원:**
  - **1순위 (최우선):** `openai('gpt-5.6-terra')`
  - **2순위 (Fallback):** `openai('gpt-5.6-luna')`
  - **3순위 (Fallback):** `google('gemini-3.7-flash')`
- **무료 회원(3회 체험) & Basic 회원:**
  - **1순위:** `google('gemini-3.7-flash')`
  - **2순위 (Fallback):** `openai('gpt-5.6-luna')`
- **엔진 제어 파라미터 유지:**
  - `temperature: 0.75`
  - `streamText` 실시간 스트리밍
  - 실시간 Tavily 검색 RAG 결합
  - 스마트에디터 ONE 서식 100% 호환 인라인 HTML 태그 강제 (22px 소제목 등)

---

### 2. 10대 추천 키워드 클러스터링 발굴기 (`src/actions/curation.ts` & `src/app/dashboard/DashboardCuration.tsx`)
- **1순위 (기본 모델):** `google('gemini-3.7-flash')` (초고속 처리 및 Vercel AI SDK `generateObject` Zod 스키마 구조화)
- **2순위 (Fallback):** `openai('gpt-5.6-luna')`
- **대시보드 연동:** `DashboardCuration.tsx`에서 `gemini-3.7-flash`로 호출 연동

---

## 🧪 빌드 및 안정성 검증
- `npm run build` 로컬 프로덕션 빌드 및 TypeScript 정적 타입 검사 성공 완료 (`Exit Code 0`)
