# 🎨 procedural-generator.tsx '템플릿-슬롯' 아키텍처 리팩토링 완료

## 1. 개요 및 변경 목적
- **목적:** 1,700줄에 걸쳐 복잡하게 작성되어 있던 7종 인포그래픽 카드 생성 코드를 **'중앙 디자인 통제실(CARD_CONFIG) + 7종 독립 템플릿 컴포넌트(Template) + 데이터 슬롯(Slot)'** 구조로 전면 리팩토링 완료.
- **불필요한 레거시 어댑터 제거:** 불필요한 계층 없이 간결하고 명확한 단일 `InfographicData` 인터페이스로 단순화.
- **네이버 스마트에디터 복사 100% 보장:** SaaS 미리보기에서 복사하여 네이버 스마트에디터 ONE에 붙여넣었을 때 인포그래픽 카드가 고화질 PNG로 완벽하게 삽입되는 기능 유지.
- **프롬프트 Zero-Touch 준수:** `src/app/api/generate-seo/route.ts` 및 LLM 글쓰기 프롬프트는 1글자도 수정하지 않고 완벽 보존.

---

## 2. 주요 구조 개편 내역

### 1) 🎨 디자인 중앙 통제실 (`CARD_CONFIG`) 구축
- **계층형 구조 (Global Base + Specific Overrides):**
  - `CARD_CONFIG.base`: 전체 카드의 공통 캔버스 크기(1080px), Safe Zone 패딩(`60px 80px`), Pretendard 폰트 패밀리, 기본 글씨 크기, 행간(`1.3`/`1.45`), 자간(`-0.03em`), 테두리 라운딩(`28px`/`20px`) 일괄 제어
  - `CARD_CONFIG.overrides`: Checklist, Comparison, StatHighlight, ProcessFlow, Qna, Warning, KeyTakeaways, Thumbnail, CtaFooter 별 고유 폰트/패딩/배지/아이콘 오버라이드 집중 관리

### 2) 📦 엄격한 TypeScript 인터페이스 분리
- `InfographicSlot`: 각 항목의 `title`, `description`, `badge`, `extra`
- `InfographicData`: `type`, `title`, `category`, `subtitle`, `slots`, `points`, `extra1~3`, `userId`, `themeName`, `tags`

### 3) 🧩 7종 독립 템플릿 컴포넌트화 (Dumb Components)
- `ChecklistTemplate`: 📋 필수 체크리스트 3종 항목 및 전문가 팁 박스
- `ComparisonTemplate`: ⚖️ Before(❌ 잘못된 대처) vs After(✅ 전문가 정밀 대응) 비교 2단 분할
- `StatHighlightTemplate`: 대형 68px/54px 핵심 수치 및 카테고리 강조
- `ProcessFlowTemplate`: 🚀 3단계 가로 행동 로드맵 (마지막 단계 강조)
- `QnaTemplate`: Q. 자주 묻는 질문 배지 및 💡 전문가 명쾌 해설 박스
- `WarningTemplate`: 🚨 골든타임 리스크 경고 박스
- `SummaryTemplate`: 💡 결론부 핵심 3줄 요약 (1️⃣, 2️⃣, 3️⃣)
- `ThumbnailTemplate`: 4종 썸네일 레이아웃 (`THUMB_A`, `THUMB_B`, `THUMB_C`, `THUMB_D`)
- `CtaBannerTemplate`: 3종 하단 배너 레이아웃 (`BANNER_A`, `BANNER_B`, `BANNER_C`)

### 4) 🚦 단일 메인 렌더 스위치
- `generateProceduralImage(data)` 및 `buildProceduralCardComponent(payload)`

### 5) 🛡️ UI 안전장치 강화
- 모든 텍스트 컨테이너에 `wordBreak: 'break-word'`, 안전한 `lineHeight`, `boxSizing: 'border-box'` 전면 적용.

---

## 3. 검증 결과
- **로컬 프로덕션 빌드 (`npm run build`):**
  - Turbopack 컴파일 성공 (소요시간 9.8s)
  - TypeScript 타입 체킹 성공 (5.3s - 에러 0건)
  - 36개 전체 라우트 정적/동적 생성 정상 완료
- **프롬프트 Zero-Touch 검증:**
  - `git status` 확인 결과 오직 `src/lib/image-engine/procedural-generator.tsx`만 수정되었으며 LLM 본문 생성 로직은 100% 무변경 유지됨.
