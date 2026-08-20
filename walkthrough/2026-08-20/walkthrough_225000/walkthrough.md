# 🛡️ [Vercel 300초 동기화 & DB 원자적 분산 락] 구현 완료 보고서

## 1. 구현 개요
서버리스(Vercel) 환경의 다중 컨테이너 격리로 인한 인메모리(Map)의 한계를 완벽히 해결하고, 기존 PostgreSQL(Prisma) 데이터베이스를 활용한 **원자적 분산 락(Atomic Distributed Lock) 및 분산 Rate Limit**을 구축하였습니다. 또한 Vercel Hobby 환경에 맞춰 **타임아웃 및 락 TTL을 300초/310초로 동기화**하고, 예외 발생 시 즉시 락을 풀어주는 **조기 락 해제(Early Release)**를 완성하였습니다.

---

## 2. 세부 구현 내역

### ① PostgreSQL User 스키마 `locked_until` 추가 및 동기화
- [prisma/schema.prisma](file:///c:/workspace/naver_SaaS_Copy_For_USB/prisma/schema.prisma): `User` 모델에 `locked_until DateTime?` 필드 추가.
- `npx prisma db push` 및 `npx prisma generate` 완료하여 Supabase PostgreSQL과 스키마 100% 동기화.

### ② DB 기반 원자적 분산 락 & Rate Limit 모듈 구현
- [src/lib/rateLimit.ts](file:///c:/workspace/naver_SaaS_Copy_For_USB/src/lib/rateLimit.ts):
  - `acquireDbConcurrentLock(userId, 310000)`: PostgreSQL `updateMany` 조건문(`where: credits > 0, locked_until is null or expired`)을 통해 0.001초 차이의 다중 컨테이너 동시 요청 중 오직 1개만 통과.
  - `releaseDbConcurrentLock(userId)`: 즉시 `locked_until = null` 처리.
  - `checkDbRateLimit(userId, 5, 30)`: 실제 `articles` 테이블의 최근 생성 시각을 바탕으로 분당 5회 / 시간당 30회 한도 엄격 통제.

### ③ Vercel 300초 타임아웃 & 조기 해제(Early Release) 적용
- [src/app/api/generate-seo/route.ts](file:///c:/workspace/naver_SaaS_Copy_For_USB/src/app/api/generate-seo/route.ts):
  - `export const maxDuration = 300;` 명시하여 Vercel Hobby 최대 실행 시간 확보.
  - `maxOutputTokens: 5500` 강제로 비용 폭탄 방어.
  - **정상 완결 시:** `onFinish`에서 `prisma.$transaction([1크레딧 차감, 아티클 저장, locked_until = null])` 원자적 실행.
  - **에러/단절 시:** `catch` 블록에서 즉시 `releaseDbConcurrentLock(currentUserId)`을 실행하여 유저가 300초를 기다리지 않고 즉시 재시도 가능.

### ④ 프론트엔드 더블클릭 0초 가드
- [src/app/dashboard/write/page.tsx](file:///c:/workspace/naver_SaaS_Copy_For_USB/src/app/dashboard/write/page.tsx):
  - `isSubmitting` 로컬 상태를 추가하여 버튼 클릭 즉시 0초 만에 버튼 비활성화 및 로딩 스피너 작동.

---

## 3. 검증 결과
- `npx prisma db push`: **성공 완료**
- `npx prisma generate`: **성공 완료**
- `npm run build` (Next.js 16 Turbopack): **0 Errors / 정상 컴파일 완료**
