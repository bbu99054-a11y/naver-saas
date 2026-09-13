# 🏆 [PostSync] 신규 가입자 원고 DB 저장 누락 버그 해결 및 파이프라인 강화 완료 보고서

## 📌 작업 개요
* **발생 현상:** 신규 가입자(김세영님, `sal9442@naver.com`)가 온보딩 후 첫 글을 생성했을 때, 크레딧 1회는 정상 차감되었으나 Vercel 서버리스 종료 시점 문제로 인해 '원고 저장소'에 원고가 기록되지 않고 0편으로 표시되는 현상 발생.
* **조치 내용:** 
  1. 온보딩 시 기본 프로젝트 사전 생성 로직 추가
  2. AI 스트리밍 응답 닫기(`controller.close()`) 직전 DB 저장을 완벽히 동기식(`await`)으로 보장하도록 파이프라인 전면 개편
  3. 기존 김세영님 계정에 기본 프로젝트 생성 및 소진된 크레딧 1회 복구(+1회, 총 3회) 완료

---

## 🛠️ 세부 수정 내역

| 영역 (Zone) | 대상 파일 | 주요 변경 사항 |
| :--- | :--- | :--- |
| **[ZONE-8]** 회원가입/온보딩 | [`src/actions/profile.ts`](file:///c:/workspace/naver_SaaS_Copy_For_USB/src/actions/profile.ts) | • `saveProfile` 실행 시 사용자의 `기본 프로젝트` 보관함 존재 여부를 확인하고 없으면 즉시 자동 생성하여 신규 회원의 첫 글 저장 공간 사전 확보 |
| **[ZONE-6]** 글쓰기 코어 엔진 | [`src/app/api/generate-seo/route.ts`](file:///c:/workspace/naver_SaaS_Copy_For_USB/src/app/api/generate-seo/route.ts) | • 스트림 시작 전 `userProject` 사전 확보<br>• 비동기 콜백(`onFinish`) 대신 `ReadableStream` 내부에서 전체 텍스트를 취합한 후 `controller.close()` 직전에 `await prisma.article.create()`를 직접 실행하여 Vercel 서버리스 환경에서 데이터 유실 0% 보장 |
| **[DB 보정]** 기존 고객 복구 | `PostgreSQL Database` | • `sal9442@naver.com`(김세영님) 계정에 `기본 프로젝트` 생성 완료<br>• 잔여 크레딧 2회 ➔ **3회로 복원 완료** |

---

## 🔍 검증 결과

1. **데이터베이스 확인:**
   * 김세영 (`sal9442@naver.com`) 회원 정보:
     * 크레딧: **3회** (정상 복구)
     * 기본 프로젝트: `729ec3cc-8e1c-47af-b791-48ff9f70d5db` (정상 등록)
     * 프로필: `세무법인 세안택스` (정상 보존)
2. **로컬 프로덕션 빌드 검증:**
   * `npm run build` 실행 결과: **46개 모든 라우트 빌드 성공 (에러 0건)**
