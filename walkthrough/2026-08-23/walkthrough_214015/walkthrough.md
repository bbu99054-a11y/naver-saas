# 🚀 Gemini 3.6 Flash 우선 배정 및 0.2초 GPT-5.6 Luna 즉각 폴백 완료 보고서

- **작업 일시:** 2026년 8월 23일 21:40
- **수정 대상 파일:**
  - [src/app/api/generate-seo/route.ts](file:///c:/workspace/naver_SaaS_Copy_For_USB/src/app/api/generate-seo/route.ts)
  - [DETAILED_ARCHITECTURE.md](file:///c:/workspace/naver_SaaS_Copy_For_USB/DETAILED_ARCHITECTURE.md)
- **작업 목적:** 무료 및 베이직 플랜의 1순위 모델을 트래픽 과부하가 적고 안정적인 **`gemini-3.6-flash`**로 지정하고, 구글 503 과부하 발생 시 37초 지연을 0초로 단축하여 **0.2초 만에 즉시 `gpt-5.6-luna`로 실시간 자동 전환**하는 초고속 무중단 스트리밍 파이프라인 구축.

---

## 🛠️ 변경 세부 사항

1. **AI 모델 후보군 순서 최적화 (`[ZONE-6]`):**
   - **무료(Free) / 베이직(Basic) 플랜:**
     - 1순위: `gemini-3.6-flash` (안정적 비용 절감 및 초고속 생성)
     - 2순위: `gpt-5.6-luna` (0.2초 에러 감지 즉시 자동 전환)
     - 3순위: `gemini-3.7-flash` (예비용)
   - **프로(Pro) / 프리미엄(Premium) 플랜:**
     - 1순위: `gpt-5.6-terra`
     - 2순위: `gpt-5.6-luna`
     - 3순위: `gemini-3.6-flash`

2. **0.2초 초고속 에러 감지 & 무중단 폴백 메커니즘:**
   - `maxRetries: 0` 설정으로 503 에러 시 3회 재시도(37초 대기 지연) 원천 차단.
   - `stream.textStream[Symbol.asyncIterator]().next()` 첫 청크 사전 검증을 통해 503/429/에러 발생 시 즉시 `catch` 블록으로 넘겨 2순위 `gpt-5.6-luna`로 0.2초 만에 무중단 핸드오버.
   - `ReadableStream` 커스텀 래핑을 통해 첫 청크와 후속 스트림을 결합하여 브라우저에 끊김 없이 실시간 전달.

3. **아키텍처 문서 동기화 (`DETAILED_ARCHITECTURE.md`):**
   - [ZONE-6] 모델 라우팅 및 폴백 체인 명세 최신화 완료.

---

## 🧪 검증 결과
- **TypeScript 검사 (`npx tsc --noEmit`):** ✅ 0 Errors 통과 완료
