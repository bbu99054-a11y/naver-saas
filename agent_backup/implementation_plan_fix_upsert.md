# 글쓰기 생성 에러 해결 플랜 (PgBouncer 트랜잭션 충돌 버그)

롱테일 키워드로 **[바로 글쓰기]** 버튼을 클릭하여 글을 생성하려고 할 때 진행이 안 되고 에러가 발생하는 원인을 분석했습니다.

## 🚨 버그 원인 분석
이전 세션의 온보딩 페이지에서 발생했던 문제와 **정확히 동일한 원인**입니다. 
Vercel에서 Supabase(PostgreSQL) 서버로 연결할 때 커넥션 풀링(PgBouncer)을 사용 중인데, Prisma ORM의 `upsert` 함수가 내부적으로 트랜잭션을 생성하여 충돌(Transaction Isolation 에러)을 일으키고 있습니다.

`src/app/api/generate-seo/route.ts` (글 생성 API) 파일 내부에 유저 크레딧을 검사하기 위해 `prisma.user.upsert` 함수가 여전히 남아있어 이 사달이 난 것입니다.

## User Review Required

> [!WARNING]
> 이 버그는 API 설정 페이지(`src/actions/settings.ts`)에도 숨어있는 것을 확인했습니다.
> 차후에 API 키를 등록하실 때도 동일하게 에러가 발생할 예정이므로, 이번 플랜에서 프로젝트 내에 남아있는 모든 `upsert` 함수를 한꺼번에 소탕(제거)하려고 합니다. 진행할까요?

## Proposed Changes

### 1. 글쓰기 API 내 `upsert` 로직을 수동 분기 처리로 변경
내부 트랜잭션을 강제로 발생시키는 `upsert`를 버리고, `findUnique`로 먼저 조회 후 `create` 또는 `update`를 수행하는 안정적인 로직으로 우회합니다.
#### [MODIFY] `src/app/api/generate-seo/route.ts`
- `prisma.user.upsert` 로직을 `prisma.user.findUnique` + `prisma.user.create` 2단계 로직으로 변경.

### 2. API 설정 페이지 내 잠재적 에러 제거
마찬가지로 향후 발생할 버그를 예방하기 위해 API 키 저장 로직을 수정합니다.
#### [MODIFY] `src/actions/settings.ts`
- `prisma.apiKey.upsert` 로직을 분기 처리로 변경.

## Verification Plan
### Manual Verification
- 배포 후 대시보드 큐레이션에서 롱테일 키워드로 [바로 글쓰기] 버튼을 클릭 시, 정상적으로 AI 원고 생성이 시작되고 글자(스트리밍)가 찍히는지 확인합니다.
