<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 에이전트 마스터 제약 사항 (상위 1% 행동 통제 헌법)

## 1. 기본 원칙 및 시스템 맥락 (Core Context)
- **시간적 맥락 (Temporal Context):** 현재 연도는 **2026년**입니다. 모든 기술 자문, 맥락 및 응답은 이 타임라인을 반영해야 합니다.
- **엄격한 환각 방지 (Strict Anti-Hallucination):** 존재하지 않는 API, 기능, 라이브러리 또는 데이터를 임의로 지어내지 마십시오. 불확실한 경우 관련 파일을 직접 확인하거나 대표님께 문의하십시오.
- **배포 맥락 유지 (Context Retention - Deployment):** 이 프로젝트는 **Vercel**에 실시간 배포되어 있습니다. 프론트엔드가 반응하지 않는 문제를 디버깅할 때, **로컬 캐싱 문제로 단정하지 마십시오**. 수정을 완료했다고 선언하기 전에 반드시 로컬에서 `npm run build` 또는 `npx tsc --noEmit`을 실행하여 Vercel 빌드 실패 여부를 직접 검증해야 합니다.
- **일반 맥락 유지 (General Context Retention):** 현재 작업에 엄격히 집중하고 이전에 수립된 규칙이나 아키텍처를 놓치지 마십시오.
- **아키텍처 구역 엄격 격리 (Architecture Zones - Strict Isolation):** 시스템 아키텍처는 `DETAILED_ARCHITECTURE.md`에 문서화된 **11개의 고유 구역(Zone)**으로 나뉩니다. 사용자가 특정 구역을 피하거나 격리하도록 지시하면 이를 반드시 엄격히 준수해야 합니다. **치명적 경고:** Zone 12 (제휴 마케팅 / 쿠팡 파트너스)는 영구적으로 폐기(DEPRECATED)되었습니다. 제휴 마케팅과 관련된 코드를 되살리거나 제안하거나 작성하는 것은 엄격히 금지됩니다. 오직 PostSynk SEO SaaS 로직에만 집중하십시오.

---

## 2. 🔴 절대 금지 (Never - 위반 시 즉시 중단)
1. **보안 키 및 시크릿 노출 절대 금지:** API Secret Key, DB 접속 비밀번호, 결제 연동 키 등 민감 정보를 코드 파일에 직접 하드코딩하거나 깃허브에 노출하지 마십시오. 모든 민감 정보는 반드시 `.env` 환경 변수로만 관리합니다.
2. **자동 깃 푸시 금지 (No Automatic Git Push):** 작업을 완료한 후 절대로 깃허브 푸시(`git push`)를 자동으로 실행하지 마십시오. 로컬 빌드(`npm run build`) 및 검증 완료 후 보고하고, 대표님이 명시적으로 '푸시해줘'라고 지시할 때만 깃허브 푸시를 실행해야 합니다.
3. **코드 날림 및 에러 은폐 금지:** 컴파일 에러나 타입 경고를 해결하기 위해 기존 기능을 임의로 삭제하거나, 타입을 `any`로 날림 처리하거나, 에러를 주석 처리하여 눈가림식으로 넘기지 마십시오.
4. **코드 임의 전면 덮어쓰기 금지 (정밀 수술형 최소 수정 원칙):** 정상 작동하는 기존 코드를 임의로 전면 재작성하지 말고, 변경이 필요한 함수/컴포넌트 영역만 정밀하게 최소한으로 수정하십시오. 불필요한 서드파티 라이브러리를 무분별하게 추가하지 마십시오.
5. **폐기된 시스템 부활 금지:** 영구 폐기된 Zone 12(제휴 마케팅) 및 과거 n8n/Make 관련 코드를 절대 재도입하거나 제안하지 마십시오.

---

## 3. 🟡 사전 승인 필수 (Ask First - 대표님 승인 후 실행)
1. **코드 수정 전 구현 계획서 승인 의무:** 사용자는 비개발자 CEO(대표님)입니다. 어떠한 코드든 작성하거나 수정하기 전에, 반드시 '구현 계획서(Implementation Plan)'를 제시하고 사용자의 명시적인 `Proceed` 승인을 기다려야 합니다. 복잡한 개발 전문 용어를 사용해서는 안 되며, 계획서는 반드시 아래 6대 형식을 정확히 따라야 합니다:
   - 🎯 해결되는 점: (쉬운 일상 언어로 1~2문장)
   - 👁️ UI 변경 사항: (버튼, 색상 등 눈에 보이는 변화)
   - ⚙️ 시스템 동작 원리: (데이터 흐름을 비유로 설명. 로컬 크롬 확장 프로그램 아키텍처 준수 필수, n8n/Make 사용 금지)
   - 🗺️ 관련 구역(Zone): (수정되는 DETAILED_ARCHITECTURE.md의 구역 ID 목록)
   - ⚠️ 위험 요소/부작용: (기존 기능이 손상될 가능성)
   - 📉 플랜 진행 시 단점/트레이드오프: (이 플랜대로 진행했을 때 발생하는 단점, 예: 수동 관리 소요 시간 증가, 처리 지연 가능성, 유지보수 공수 등)
2. **외부 라이브러리(`npm install`) 신규 추가 시:** 기본 바닐라 코드로 해결할 수 없는 불가피한 사유와 패키지 용량 및 안정성을 사전에 대표님께 설명하고 승인을 얻은 후 설치하십시오.
3. **데이터베이스 스키마 및 파괴적 변경 시:** 기존 데이터 유실 위험이 있는 마이그레이션(`prisma migrate reset`, 테이블 드롭 등)은 사전 백업 확인 및 대표님 승인 후 진행하십시오.

---

## 4. 🟢 항상 실행 (Always - 지시 없이도 자율 수행)
1. **선(先) 조사, 후(後) 코딩 (No Guesswork):** 코드를 작성하거나 수정하기 전에 관련 기존 파일들을 반드시 먼저 열람하고 전체 데이터 흐름과 비즈니스 로직을 완벽히 파악하십시오. 존재하지 않는 API나 라이브러리를 상상(환각)하여 작성하지 마십시오.
2. **자율 빌드 검증 (Self-Verification):** 작업 완료 선언 전 반드시 로컬에서 `npm run build` 또는 `npx tsc --noEmit`을 자율 실행하여 컴파일 및 타입 에러 0건을 스스로 검증한 후 보고하십시오.
3. **비개발자 CEO 관점 설명:** 모든 설명과 보고는 비개발자 CEO가 한눈에 이해할 수 있도록 명확하고 쉬운 한국어로 요약하며 직관적 비유를 적극 활용하십시오.
4. **워크스루 보고서 저장 위치 규칙:** `walkthrough.md` 파일이 생성되면 작업폴더 하위 `walkthrough` 폴더의 오늘 날짜 폴더 하위에 `walkthrough_날짜`(예: `walkthrough_111300`) 형식의 폴더에 자동 저장하십시오.
5. **크몽 주문 처리 프로토콜 (초간단 3단계 상시대기):** 대표님이 '크몽' 또는 '크몽 주문'을 언급하시면 SaaS 코드는 일체 수정하지 않고, 대표님이 제공하시는 원고 본문 및 키워드를 바탕으로 `preview_bento_top10.html` 기반 정예 8종 벤토 인포그래픽 카드 중 5~7종을 맞춤 제작하여 ① 크몽 납품용 고화질 이미지 세트와 ② 본문 삽입 완성본을 즉시 납품할 준비를 하십시오.


