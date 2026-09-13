# 📞 하단 상담 배너 1.5px 슬림화 & 고객 사무소명 대형화 구현 완료 보고서

## 📌 작업 개요
* **목표:**
  1. 하단 배너 카드 3종(`BANNER_A`, `BANNER_B`, `BANNER_C`)의 투박했던 3px 외곽선을 **1.5px 세련된 모던 프레임**으로 전면 슬림화.
  2. 기존 일반 문구(`"1:1 맞춤 전문 상담 안내"`) 대신 **고객의 실제 사무소명(예: `정원 사랑 변호사`)**을 배너 메인 타이틀에 **`50~52px Bold` 대형 폰트**로 전면 배치.
  3. 주소가 길어질 경우(도로명 + 상세주소/호수)에도 글자가 찌그러지지 않도록 **줄간격(`lineHeight: 1.3`) 및 2줄 정렬 방어**.
* **원칙 준수:**
  * **글쓰기 AI 코어 엔진(`[ZONE-6]`: `src/app/api/generate-seo/route.ts`)은 단 1줄도 건드리지 않고 100% 무변경 보존**.

---

## 🛠️ 세부 변경 내역

### 1. [`procedural-generator.tsx`](file:///c:/workspace/naver_SaaS_Copy_For_USB/src/lib/image-engine/procedural-generator.tsx)
* **`CtaBannerTemplate` 컴포넌트 업그레이드:**
  * **사무소명 지능형 주입:** `data.title`이 일반 문구인 경우 `data.signature`를 감지하여 고객 사무소명(`"정원 사랑 변호사"`)을 메인으로 자동 승격.
  * **사무소명 폰트 크기:** `50~52px Bold`로 대형화하여 배너 상단 주목도 극대화.
  * **테두리선 슬림화:** 외곽선 `3px` ➡️ `1.5px solid ${palette.accent}` / `${palette.border}`로 세련되게 교체.
  * **내부 정보 카드 개선:**
    * `📞 직통 상담:` `44px` 볼드 하이라이트.
    * `🏢 오시는 길:` `26~28px` 및 `lineHeight: 1.3`으로 긴 주소도 깔끔하게 2줄 배치.

### 2. [`templates.ts`](file:///c:/workspace/naver_SaaS_Copy_For_USB/src/lib/templates.ts) & [`INFOGRAPHIC_SPEC_GUIDE.md`](file:///c:/workspace/naver_SaaS_Copy_For_USB/INFOGRAPHIC_SPEC_GUIDE.md)
* `getFooterBannerTemplate` URL 예시 및 표준 명세서에 `title=(전문가+사무소명)` 사양 갱신 완료.

---

## 🧪 검증 결과
* **Next.js 빌드 및 컴파일:** `cmd.exe /c "npm run build"` ➡️ **Exit Code 0 (에러 0건 성공)**
* **글쓰기 엔진 격리:** `src/app/api/generate-seo/route.ts` 0줄 변경 확인.
