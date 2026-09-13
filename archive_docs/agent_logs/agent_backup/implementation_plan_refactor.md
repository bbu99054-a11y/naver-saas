# 1차 완성본 (MVP) 총괄 점검 및 2026년형 성능/아키텍처 최적화 계획

현재 구현된 1차 완성본은 소상공인 SEO 퍼블리싱이라는 핵심 비즈니스 로직을 완벽히 수행하고 있습니다. 하지만 MVP 특성상 기능 구현에 집중되어 있어, 2026년 Next.js 15 및 React 19 기준에 맞춘 성능 최적화와 구식 패턴 개선이 필요합니다.

## User Review Required

> [!IMPORTANT]
> 아래 제안된 최적화 작업 중 우선적으로 적용하고 싶은 부분이 있다면 말씀해 주세요. 전체를 한 번에 적용할 경우 리팩토링 시간이 소요될 수 있습니다.

## Proposed Changes

### 1. Data Fetching 패턴 현대화 (React Server Components)
- **개선 대상**: `src/app/dashboard/DashboardCuration.tsx`
- **문제점**: 현재 `useEffect` 내부에서 `fetch`를 호출하는 방식은 2022~2023년의 구식 클라이언트 렌더링 패턴입니다. 이로 인해 초기 화면 렌더링 시 깜빡임(CLS)이 발생하고 성능이 저하됩니다.
- **해결책**: 해당 컴포넌트를 Server Component로 전환하거나, React 19의 `use()` 훅과 `<Suspense>` 경계를 활용하여 서버에서 직접 AI 클러스터링 데이터를 Streaming 하도록 개선합니다.

### 2. 서버 통신 병렬 처리 (Promise.all)
- **개선 대상**: `src/app/api/generate-seo/route.ts`
- **문제점**: 유저 검증, 크레딧 확인, 프로필 조회가 직렬(순차적)로 `await` 되어 있어 API 응답 시작까지의 지연(Latency)이 발생합니다.
- **해결책**: 서로 의존성이 없는 DB 조회 로직(`dbUser` 검증, `profile` 조회)을 `Promise.all`로 병렬 처리하여 TTFB(Time To First Byte)를 30% 이상 단축합니다.

### 3. 외부 API 응답 캐싱 (Next.js Cache)
- **개선 대상**: `src/lib/scraper.ts` (네이버 SERP 스크래핑)
- **문제점**: 동일한 키워드 검색 시 매번 네이버를 새로 스크래핑하여 시간(약 3~5초)이 소요됩니다.
- **해결책**: Next.js 15의 `unstable_cache` 또는 `fetch` 캐시 옵션을 사용하여 동일한 키워드에 대한 SERP 분석 결과를 1시간 동안 Redis/디스크에 캐싱합니다.

### 4. 번들 사이즈 최적화 및 Lazy Loading
- **개선 대상**: `src/app/dashboard/write/page.tsx`
- **문제점**: Lucide 아이콘이나 무거운 에디터 관련 컴포넌트가 초기 JS 번들에 모두 포함되어 모바일 환경에서 로딩이 무겁습니다.
- **해결책**: `next/dynamic`을 활용하여 즉시 화면에 보이지 않는 UI(예: 익스텐션 미설치 모달, 복사 버튼 류)를 Lazy Loading 처리합니다.

### 5. UI/UX 피드백 루프 개선 (useTransition)
- **개선 대상**: 프로필 저장 및 글 생성 버튼
- **문제점**: 단순 상태 `isLoading`을 사용하여 React의 동시성 렌더링(Concurrent Rendering) 이점을 살리지 못합니다.
- **해결책**: Server Action 호출 시 `useTransition` 훅을 사용하여 UI 멈춤을 방지하고 훨씬 부드러운 유저 경험을 제공합니다.

## Verification Plan

### Automated Tests
- `npm run build`를 통해 빌드 시 발생하는 Warning이 없는지 확인.
- Bundle Analyzer를 통해 JS 초기 로딩 파일 크기가 감소했는지 확인.

### Manual Verification
- 대시보드 큐레이션 접속 시 깜빡임 없이 로딩 스켈레톤(Suspense)이 자연스럽게 작동하는지 확인.
- 동일한 키워드로 글 생성 시 이전보다 스크래핑 속도가 눈에 띄게 단축(캐싱 효과)되었는지 체감 확인.
