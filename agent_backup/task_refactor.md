# 리팩토링 및 최적화 작업 목록

## 1. Data Fetching 패턴 현대화 (Server Components)
- `[x]` `src/app/dashboard/DashboardCuration.tsx`를 Client Component에서 Server Component로 전환
- `[x]` `src/app/dashboard/page.tsx`에 Suspense 래핑 및 로딩 스켈레톤 추가
- `[x]` 불필요한 API 라우트(`/api/generate-clusters`) 호출 대신 서버에서 직접 AI SDK 호출

## 2. 서버 통신 병렬 처리 (Promise.all)
- `[x]` `src/app/api/generate-seo/route.ts`의 유저 검증 로직 병렬화 (`dbUser` & `profile` 조회)

## 3. 외부 API 응답 캐싱 (Next.js Cache)
- `[x]` `src/lib/scraper.ts` 파일 내 네이버 검색 결과 파싱 함수에 `unstable_cache` 적용

## 4. 번들 사이즈 최적화 및 Lazy Loading
- `[x]` `src/app/dashboard/write/page.tsx` 내부 컴포넌트 `next/dynamic` 적용 (에디터 관련 UI) 및 불필요한 패키지(`marked`) 정리

## 5. UI/UX 최적화 (useTransition)
- `[x]` `src/app/onboarding/page.tsx` 프로필 저장 로직에 `useTransition` 적용

## 6. 검증 (Verification)
- `[x]` TypeScript 에러 해결 완료 (`onValueChange` 타입 에러, Server Action 반환 타입 에러)
- `[x]` Next.js 16 deprecated convention (`middleware.ts` -> `proxy.ts`) 수정 완료
- `[x]` 빌드 성공 검증 완료
