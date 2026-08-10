# 키워드 기능 통합 및 개선 플랜 (Keyword Refactor Plan)

대표님께서 지적하신 바와 같이, 현재 대시보드의 '오늘의 추천 키워드'와 사이드메뉴의 '키워드 리서치' 기능은 역할이 겹치고 혼란을 줄 수 있습니다. 
또한 두 기능 모두 실질적인 작동이 불가한 상태였습니다. (원인: Vercel 환경에 네이버 검색광고 API 키와 Customer ID가 입력되지 않아 백엔드 통신이 모두 실패하고 있었으며, 추천 키워드가 강제로 '0건(10미만)' 처리되고 있었습니다.)

이를 근본적으로 해결하기 위해 두 기능을 하나로 깔끔하게 통합하고, 불안정한 네이버 API 의존도를 완전히 제거하는 플랜을 제안합니다.

## User Review Required

> [!IMPORTANT]
> 네이버 광고 API(검색량 데이터)는 키 발급 절차가 매우 복잡하여(사업자 인증 등) SaaS 서비스에서 관리하기 까다롭습니다. 
> 본 플랜은 네이버 API 연동을 **완전히 제거**하고, AI가 분석한 '블루오션 지수'나 '추천도'로 검색량 숫자를 대체하는 방향입니다. 승인하시겠습니까?

## Proposed Changes

### 1. 사이드메뉴 '키워드 리서치' 제거 (기능 통합)
수동으로 검색하는 리서치 페이지는 역할이 중복되므로 과감히 삭제하여 대시보드의 'AI 추천' 기능에 집중하게 합니다.
#### [DELETE] `src/app/dashboard/research/page.tsx`
#### [DELETE] `src/app/api/naver-keyword/route.ts`
#### [MODIFY] `src/components/Sidebar.tsx` (리서치 메뉴 링크 삭제)

### 2. 대시보드 큐레이션 개선 및 네이버 API 의존성 제거
기존에 검색량을 보여주기 위해 네이버 API를 호출하던 로직을 삭제합니다. 대신 AI가 키워드의 '예상 경쟁도'와 '전환 가치'를 평가하도록 프롬프트를 변경합니다.
#### [DELETE] `src/lib/naverApi.ts`
#### [MODIFY] `src/actions/curation.ts`
- `fetchNaverKeywords` 호출 로직 완전 삭제.
- AI 스키마를 수정하여 `monthlyPcQcCnt` 대신 `competitionLevel` (경쟁도: 낮음/보통/높음) 및 `score` (추천 점수: 1~100)를 반환하도록 프롬프트 수정.
#### [MODIFY] `src/app/dashboard/DashboardCuration.tsx`
- UI에서 "월 검색량: 10미만" 부분을 제거하고, 대신 "AI 추천 점수: 95점", "경쟁도: 낮음" 등으로 시각화 방식 변경.

## Verification Plan

### Manual Verification
- 배포 후 대시보드에서 '오늘의 맞춤형 로컬 키워드 발굴하기' 버튼 클릭 시 네이버 API 에러 없이 3개의 키워드가 즉시 생성되는지 확인.
- 키워드 카드에 숫자(검색량) 대신 'AI 추천 점수' 및 '경쟁 강도' 뱃지가 정상적으로 예쁘게 렌더링되는지 확인.
- 좌측 사이드바 메뉴에서 '키워드 발굴' 메뉴가 깔끔하게 사라졌는지 확인.
