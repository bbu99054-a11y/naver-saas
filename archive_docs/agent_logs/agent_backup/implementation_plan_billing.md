# 결제 시스템 (Toss Payments) 연동 기획 💳

대표님, SaaS의 진정한 시작은 매출 발생이죠! 한국 환경에 가장 최적화되어 있고 B2B 결제 전환율이 높은 **토스페이먼츠(Toss Payments)**를 연동하여 완전 자동화된 결제 및 크레딧 충전 시스템을 구축합니다.

## User Review Required
> [!IMPORTANT]
> 본 기획안을 검토하시고 **승인(Proceed 버튼 클릭)**해 주시면 즉시 개발에 착수합니다. 
> 개발 시 테스트용 키(Test Key)를 사용하여 구축하며, 실제 서비스 런칭 시 대표님의 실제 토스페이먼츠 라이브 키(Live Key)로만 교체하면 바로 입금이 시작됩니다.

## 1. 결제 흐름 (User Flow)
1. **요금제 선택**: 유저가 `[대시보드 > 요금제 및 결제]` 메뉴에서 Basic(49,000원) 또는 Pro(149,000원) 요금제를 선택합니다.
2. **결제창 호출**: 토스페이먼츠 위젯(신용카드, 간편결제, 계좌이체 등)이 팝업으로 뜹니다.
3. **결제 승인**: 유저가 결제를 완료하면 `성공(Success)` 페이지로 이동합니다.
4. **자동 충전**: 백엔드 서버가 토스 측에 영수증을 최종 검증한 뒤, 유저의 DB에 즉시 **크레딧을 자동 충전**합니다.

## 2. 요금제 및 크레딧 부여 스펙
- **Basic 플랜**: 49,000원 결제 시 ➡️ **10 크레딧 충전**
- **Pro 플랜**: 149,000원 결제 시 ➡️ **30 크레딧 충전** (가장 인기)

## 3. 세부 개발 범위 (Proposed Changes)

### 데이터베이스 (Prisma Schema)
결제 내역 추적과 환불/CS 처리를 위해 결제 테이블을 신설합니다.
#### [MODIFY] `prisma/schema.prisma`
- `PaymentHistory` 모델 추가: `order_id`, `payment_key`, `amount`, `status`, `plan_type` 등 기록.
- `User` 모델과 1:N 관계 설정.

### 백엔드 (API Routes)
보안 상 프론트엔드가 아닌 백엔드에서 결제를 최종 승인해야 실제 돈이 빠져나갑니다.
#### [NEW] `src/app/api/payments/confirm/route.ts`
- 토스 서버에 최종 승인(Confirm) API를 호출하여 결제가 유효한지 검증.
- 검증 성공 시 `User` 테이블의 `credits`를 요금제에 맞게 증가시킴.
- `PaymentHistory` 테이블에 결제 완료 로그 기록.

### 프론트엔드 (UI & Components)
세련된 결제 화면과 성공/실패 안내 화면을 만듭니다.
#### [MODIFY] `src/app/dashboard/pricing/page.tsx` 또는 `billing/page.tsx`
- 요금제 카드 UI 컴포넌트 적용 (Basic, Pro 등).
- 토스페이먼츠 위젯 SDK (`@tosspayments/payment-widget-sdk`) 연동.
#### [NEW] `src/app/dashboard/billing/success/page.tsx`
- 결제 완료 시 떨어지는 리다이렉트 페이지.
- 로딩 스피너와 함께 백엔드 `/api/payments/confirm`을 호출하여 최종 승인 처리.
#### [NEW] `src/app/dashboard/billing/fail/page.tsx`
- 한도 초과, 잔액 부족 등으로 결제 실패 시 안내 화면.

## 4. 검증 계획 (Verification Plan)
- 토스페이먼츠 **테스트 키**를 사용하여 가상의 카드로 49,000원과 149,000원 결제를 시도합니다.
- 결제 성공 후 대시보드 메인 화면의 잔여 크레딧이 정확하게 +10 혹은 +30으로 갱신되는지 확인합니다.
- 결제 중도 취소 시 크레딧이 오르지 않는지 검증합니다.
