# Phase 7: 타겟 직군 기반 동적 RAG 쿼리 태스크

- [x] 직군별 공공/국가 도메인 딕셔너리 맵핑 로직 작성 (`src/app/api/generate-seo/route.ts`)
- [x] Profile의 `industry` 기반으로 도메인 매칭, 매칭 실패 시 `law.go.kr` 기본값 설정
- [x] 1차 검색 (include_domains 적용) 후 결과 없을 시 2차 검색 (Fallback) 수행 로직 추가
- [x] 코드 푸시 및 Vercel 배포
- [x] 워크스루 업데이트
