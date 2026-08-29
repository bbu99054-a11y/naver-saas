<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Agent Constraints (User Defined)
1. **Temporal Context:** Assume the current year is **2026**. All technical advice, context, and responses must reflect this timeline.
2. **Strict Anti-Hallucination:** Do not invent non-existent APIs, features, or data. If you are unsure, check the files or ask the user.
3. **Context Retention (Deployment):** This project is live-deployed on **Vercel**. When debugging frontend non-responsiveness, **DO NOT assume local caching**. You MUST verify if the Vercel build failed by running `npm run build` or `npx tsc --noEmit` locally before declaring a fix complete.
4. **General Context Retention:** Maintain strict focus on the current task and do not lose sight of previously established rules or architectures.
5. **Architecture Zones (Strict Isolation):** The system architecture is divided into **11 distinct zones** documented in `DETAILED_ARCHITECTURE.md`. When the user instructs to avoid or isolate specific zones, you MUST strictly comply. **CRITICAL WARNING:** Zone 12 (Affiliate Marketing / Coupang) has been PERMANENTLY DEPRECATED. You are STRICTLY FORBIDDEN from reviving, suggesting, or writing any code related to affiliate marketing. Focus purely on the PostSynk SEO SaaS logic.
6. **Non-Developer Communication (Implementation Plan):** The user is a non-developer CEO. Before writing or modifying ANY code, you MUST present an 'Implementation Plan' and wait for the user's explicit `Proceed` approval. You must NOT use complex code jargon. The plan MUST be formatted exactly as follows:
   - 🎯 What is resolved? (1-2 sentences in plain language)
   - 👁️ UI Changes? (Visible changes like buttons, colors)
   - ⚙️ Under the hood? (Explain data flow with analogies. Must comply with local Chrome extension architecture, no n8n/Make)
   - 🗺️ Zones Touched: (List the Zone IDs from DETAILED_ARCHITECTURE.md being modified)
   - ⚠️ Risks/Side effects: (Any chance of breaking existing features)
   - 📉 플랜 진행 시 단점/트레이드오프: (이 플랜대로 진행했을 때 발생하는 단점, 예: 수동 관리 소요 시간 증가, 처리 지연 가능성, 유지보수 공수 등)
7. **No Automatic Git Push:** 작업을 완료한 후 절대로 깃허브 푸시(`git push`)를 자동으로 실행하지 마십시오. 로컬 빌드(`npm run build`) 및 검증 완료 후 보고하고, 대표님이 명시적으로 '푸시해줘'라고 지시할 때만 깃허브 푸시를 실행해야 합니다.

8. walkthrough.md 파일이 생성되면 작업폴더 하위 walkthrough 폴더에 오늘날짜의 폴더에 하위에 walkthrough_날짜(예:walkthrough_111300) 이런식으로 폴더에 저장한다.

9. **High-End Senior Engineer Coding Directive (바이브 코딩 마스터 지침):**
   - **① 선(先) 조사, 후(後) 코딩 (No Guesswork):** 코드를 작성하거나 수정하기 전에 관련 기존 파일들을 반드시 먼저 열람하고 전체 데이터 흐름과 비즈니스 로직을 완벽히 파악한다. 존재하지 않는 API나 라이브러리를 상상(환각)하여 작성하지 않는다.
   - **② 정밀 수술형 최소 수정 (Surgical Edits):** 정상 작동하는 기존 코드를 임의로 전면 재작성하지 말고, 변경이 필요한 함수/컴포넌트 영역만 정밀하게 최소한으로 수정한다. 불필요한 서드파티 라이브러리를 무분별하게 추가하지 않는다.
   - **③ 자율 빌드 검증 (Self-Verification):** 작업 완료 선언 전 반드시 로컬에서 `npm run build` 또는 `npx tsc --noEmit`을 자율 실행하여 컴파일 및 타입 에러 0건을 스스로 검증한 후 보고한다.
   - **④ 비개발자 CEO 관점 설명:** 모든 설명과 보고는 비개발자 CEO가 한눈에 이해할 수 있도록 명확하고 쉬운 한국어로 요약하며 직관적 비유를 적극 활용한다.

