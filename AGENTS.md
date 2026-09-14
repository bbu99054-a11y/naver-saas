<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 🏛️ PostSync AI 에이전트 마스터 헌법 & 개발 가이드라인 (2026)

> **프로젝트 명:** PostSync AI 플랫폼 (Next.js 16 풀스택 SaaS, 무료 웹툴 7종, 5대 수익화 엔진)  
> **적용 대상:** 본 프로젝트의 모든 개발, 리팩토링, 마케팅 자동화 기능을 수행하는 AI 에이전트  
> **최종 개정:** 2026년 9월 (모노레포 단일화 및 2026 컴플라이언스 통합)

---

## 1. 🛡️ 제1조: 기본 원칙 및 시스템 맥락 (Core Context)

* **시간적 맥락 (Temporal Context - 2026년):** 현재 연도는 **2026년**입니다. 모든 기술 자문, AI 모델 라우팅, SEO 알고리즘 기준은 2026년 표준을 반영해야 합니다.
* **배포 맥락 (Vercel Production & Monorepo):**
  - 본 프로젝트는 Vercel에 실시간 자동 배포되고 있습니다 (postsyncapp.com).
  - 작업을 완료했다고 선언하기 전에 반드시 로컬에서 
pm run build를 자율 실행하여 컴파일 및 빌드 성공 여부를 스스로 검증해야 합니다.
* **단일 원천(Single Source of Truth):**
  - 웹 SaaS, 무료 웹툴 7종, 도메인 라우팅의 진짜 원본은 오직 C:\workspace\postsync입니다. 다른 폴더로 복사하거나 이원화하지 않습니다.
* **엄격한 환각 방지 (Read Before Write):**
  - 가상의 외부 라이브러리 함수나 파라미터를 임의로 지어내지 않습니다.
  - DB 쿼리를 작성할 때 상상하지 않고, [prisma/schema.prisma](file:///C:/workspace/postsync/prisma/schema.prisma)에 선언된 실제 스키마 모델을 직접 확인하고 일치시킵니다.

---

## 2. 🔴 제2조: 절대 금지 헌법 (Never - 위반 시 즉시 작업 중단)

1. **보안 키 및 시크릿 노출 절대 금지:**
   - API Secret Key, DB 접속 비밀번호, 결제 연동 키 등 민감 정보를 코드 파일에 직접 하드코딩하거나 깃허브에 노출하지 마십시오. 모든 민감 정보는 반드시 .env.local 환경 변수로만 관리합니다.
2. **사전 승인 없는 자동 깃 푸시 금지 (No Automatic Git Push):**
   - 로컬 빌드(
pm run build) 및 검증 완료 후 보고하고, 대표님이 명시적으로 '푸시해줘'라고 지시할 때만 깃허브 푸시를 실행해야 합니다.
3. **핵심 서비스 자산 임의 삭제 금지:**
   - public/ 내의 무료 웹툴 7종(crop, place, dcheck, yte, hwpx, utm, convert)과 구글 애드센스 본인 인증 파일(ds.txt), DB 스키마(prisma/)는 절대 임의로 삭제하거나 덮어쓰지 마십시오.
4. **코드 임의 전면 재작성(엎어치기) 금지 (정밀 수술형 최소 수정 원칙):**
   - 정상 작동하는 기존 코드를 임의로 전면 재작성하지 말고, 변경이 필요한 함수/컴포넌트 영역만 정밀하게 최소한으로 수정하십시오. 불필요한 서드파티 라이브러리를 무분별하게 추가하지 마십시오.
5. **코드 날림 및 에러 은폐 금지:**
   - 컴파일 에러나 타입 경고를 해결하기 위해 기존 기능을 임의로 삭제하거나, 타입을 ny로 날림 처리하거나, 에러를 주석 처리하여 눈가림식으로 넘기지 마십시오.
6. **폐기된 시스템 부활 금지:**
   - 과거 n8n/Make 관련 복잡한 툴이나 스팸성 쿠팡 파트너스 살포 코드를 재도입하거나 제안하지 마십시오.

---

## 3. 🟡 제3조: 비개발자 대표님 사전 승인 필수 (Ask First)

1. **코드 수정 전 6대 필수 형식 계획서 제출 의무:**
   사용자는 비개발자 CEO(대표님)입니다. 어떠한 코드든 작성하거나 수정하기 전에, 반드시 '구현 계획서(Implementation Plan)'를 제시하고 사용자의 명시적인 Proceed 승인을 기다려야 합니다. 복잡한 개발 전문 용어를 배제하고, 계획서는 반드시 아래 6대 형식을 정확히 준수합니다:
   - 🎯 **해결되는 점:** (쉬운 일상 언어로 1~2문장)
   - 👁️ **UI 변경 사항:** (버튼, 색상, 위치 등 눈에 보이는 변화)
   - ⚙️ **시스템 동작 원리:** (데이터 흐름을 직관적 비유로 설명)
   - 📁 **수정 대상 파일 목록:** (정확한 파일 경로 및 구역)
   - ⚠️ **위험 요소/부작용:** (기존 기능이 손상될 가능성)
   - 📉 **플랜 진행 시 단점/트레이드오프:** (이 플랜대로 진행했을 때 발생하는 단점, 예: 수동 관리 공수, 처리 지연 가능성 등)
2. **외부 라이브러리(
pm install) 신규 추가 시:**
   - 기본 바닐라 코드로 해결할 수 없는 불가피한 사유와 패키지 용량 및 안정성을 사전에 대표님께 설명하고 승인을 얻은 후 설치하십시오.
3. **데이터베이스 스키마 및 파괴적 변경 시:**
   - 기존 데이터 유실 위험이 있는 마이그레이션(prisma migrate reset, 테이블 드롭 등)은 절대 금지하며, 사전 백업 확인 및 대표님 승인 후 진행하십시오.

---

## 4. 💼 제4조: 전문직 광고 규정 컴플라이언스 100% 준수 (Legal Compliance)

전문직(변호사, 세무사, 의사, 노무사, 행정사) 마케팅 콘텐츠, 템플릿, 웹툴(dcheck) 생성 시 각 직역의 법률 광고 규정을 100% 준수하고 금칙어를 원천 차단합니다.

* **변호사 (변호사법 제23조, 변호사 광고 규정):**
  - ❌ 금지: 최고, 유일, 100% 승소, 가장 빠른, 전관예우 암시(판·검사 출신 강조), 부당 염가/할인 표방.
  - ✅ 권장: 객관적 절차 안내, 판례 분석, 논리적 대응 방안 중심 서술.
* **세무사 (세무사법 제12조, 세무사 광고 규정):**
  - ❌ 금지: 평균 환급금 명시, 환급율 1위, 절세율 최고, 타 세무사 수임료 비교, 무료/최저가 표방.
  - ✅ 권장: 세법 개정안 해설, 적법한 절세 체크리스트, 세무 조사 대비 가이드.
* **의사/병원 (의료법 제56조):**
  - ❌ 금지: 치료 효과 보장/과장, 부작용 없는 시술 표방, 전후 사진 무단 비교, 환자 유인성 가격 파괴.
  - ✅ 권장: 질환 정보, 예방 수칙, 전문의의 의학적 소견 중심 정보 제공.
* **노무사/행정사:**
  - ❌ 금지: 100% 구제/인가 장담, 공무원 사적 연고 선전, 비자격자 대행 오인 문구.

---

## 5. 🚀 제5조: 2026 SEO & GEO (생성형 검색 최적화) 표준

* **최신 AI 모델 라우팅:**
  - 빠른 처리 및 목차/요약 생성: Gemini 3.6 Flash
  - 고품질 본문 및 전문직 심층 칼럼: Gemini 3.1 Pro / Claude 3.5 Sonnet
* **2026 생성형 엔진 최적화 (GEO & Google AI Overviews):**
  - 검색 AI(Google SGE, Perplexity, ChatGPT Search)가 인용하기 쉽도록 **Answer-First (결론 우선 두괄식)** 구조를 유지합니다. 본문 첫 3줄 안에 질문에 대한 직접적이고 정량적인 답변을 제시합니다.
  - **JSON-LD 구조화 데이터** (Article + FAQPage + HowTo)를 HTML 헤더에 필수로 유지합니다.
* **네이버 C-Rank & 스마트블록 최적화:**
  - 전문성(E-E-A-T)을 입증하는 구조화된 소제목(h2, h3), 비교 테이블, 인포그래픽 카드 요소를 적극 활용합니다.
* **프론트엔드 디자인 원칙:**
  - Plus Jakarta Sans / Noto Sans KR 폰트, 정제된 컬러 팔레트, 글래스모피즘, 고대비 상태 인디케이터 등 모던 SaaS UI를 엄수합니다.

---

## 6. 💰 제6조: 웹툴 7종 & 수익화 인프라 운용 표준

* **수익화 마스터플랜 준수:**
  - 모든 신규 기능 및 웹툴 개편은 [postsync_ai_monetization_masterplan.md](file:///C:/workspace/postsync/postsync_ai_monetization_masterplan.md)의 4단계 로드맵(광고 ➔ 전자책 ➔ 리드마그넷 ➔ SaaS 구독)을 따릅니다.
* **공통 레이아웃(ToolContainer) 원칙:**
  - 각 웹툴마다 일일이 광고 코드를 넣지 않고, 표준 컴포넌트(GoogleAdSlot, LeadMagnetModal, EbookPromoCard, SaasBridgeBanner)를 통해 규격화합니다.
* **리드 수집 무결성:**
  - 고객이 툴에서 입력한 이메일/전화번호는 단일 리드 API(/api/leads)를 거쳐 DB leads 테이블에 암호화 저장하고, 관리자 텔레그램으로 즉시 알림을 발송합니다.

---

## 7. ✍️ 제7조: 카피라이팅 및 용어 정제 표준

* **용어 정제 ('타래' 및 '래퍼' 사용 전면 금지):**
  - 영어의 'Thread'를 직역한 **'타래' 또는 '타래글'이라는 용어는 절대 사용하지 않습니다.**
    - ✅ 권장 표현: (이어지는 글 👇), (댓글로 계속 👇), (아래 글로 이어집니다), (연속 글), 스레드 연재
  - 영어의 'AI Wrapper'를 음차한 **'래퍼' 또는 'AI 래퍼'라는 외래어/은어는 절대 사용하지 않습니다.**
    - ❌ 금지: AI 래퍼, 래퍼 스타트업
    - ✅ 권장 대체: 단순 AI 껍데기 서비스, 단순 API 연동 툴, 프롬프트 감싸개 서비스, 무늬만 AI인 모방 서비스
* **호흡 및 가독성:**
  - 모바일 한 화면에서 스크롤을 멈추게 하는 1~2줄 단위 줄바꿈과 여백 유지.
  - 번역투(피동형, 겹문장)를 배제하고, 현업 전문가가 직설적으로 털어놓는 구어체/자연스러운 종결어미 사용.

---

## 8. 🎨 제8조: 크몽 주문 처리 프로토콜 (상시 대기)

* 대표님이 **'크몽'** 또는 **'크몽 주문'**을 언급하시면 SaaS 코드는 일체 건드리지 않습니다.
* 대표님이 제공하시는 원고 본문 및 키워드를 바탕으로 rchive_docs/plans_and_specs/preview_bento_top10.html 기반 정예 8종 벤토 인포그래픽 카드 중 5~7종을 맞춤 제작하여:
  1. 크몽 납품용 1080x1080 고화질 카드뉴스 이미지 세트
  2. 본문 삽입 완성본 (네이버 블로그용 HTML/마크다운)
  위 2가지를 1초 만에 즉시 납품할 수 있도록 준비합니다.