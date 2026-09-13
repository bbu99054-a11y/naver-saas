# 🚀 2026년형 SaaS 배포 가이드라인 (Next.js 16 + Supabase + Chrome Extension)

이 문서는 대표님의 로컬 환경에서 개발된 "네이버 블로그 자동화 SaaS"를 2026년 최신 인프라 트렌드에 맞춰 전 세계 어디서든 접속할 수 있는 **프로덕션(Production)** 환경으로 배포하는 절차를 안내합니다.

현재 아키텍처는 크게 **[웹 서비스(Next.js)]**와 **[자동화 프로그램(Chrome Extension)]** 두 가지로 나뉩니다.

---

## 단계 1: 웹 서비스 배포 (Vercel 활용)
2026년 기준, Next.js 16(Turbopack, Server Actions)의 모든 최적화 기술을 100% 지원하는 가장 완벽한 호스팅 플랫폼은 Vercel입니다.

1. **GitHub 저장소 연동**
   - 로컬 코드를 GitHub 프라이빗 레포지토리(Private Repository)에 Push 합니다.
2. **Vercel 프로젝트 생성**
   - Vercel(https://vercel.com)에 로그인 후 `Add New Project`를 클릭하여 방금 만든 GitHub 레포지토리를 연결합니다.
3. **환경 변수(Environment Variables) 세팅**
   - 로컬의 `.env` 또는 `.env.local` 파일에 있는 값들을 Vercel 대시보드의 **Environment Variables** 메뉴에 복사해 넣습니다.
   - 필수 변수: 
     - `NEXT_PUBLIC_SUPABASE_URL` (Supabase 프로젝트 URL)
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Supabase Anon 키)
     - `DATABASE_URL` (Supabase Connection Pooling / pgBouncer 주소 - **중요: Transaction 모드 주소 사용**)
     - AI 모델 API 키 (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY` 등)
4. **Deploy 클릭**
   - Deploy 버튼을 누르면 약 2~3분 내에 빌드 및 글로벌 Edge 배포가 완료되며 접근 가능한 URL(`.vercel.app` 또는 구매한 커스텀 도메인)이 발급됩니다.

---

## 단계 2: Supabase (DB & Auth) 프로덕션 체크
개발용 DB를 프로덕션으로 전환할 때 반드시 확인해야 할 보안 및 성능 세팅입니다.

1. **RLS (Row Level Security) 정책 확인**
   - 프로덕션 환경에서는 유저가 자신의 데이터(`project`, `article`, `profile` 등)만 열람하고 수정할 수 있도록 Supabase 테이블의 RLS가 활성화되어 있는지 확인합니다.
2. **이메일 인증(SMTP) 설정 (선택)**
   - 기본적으로 제공되는 Supabase 인증 이메일 발송량에는 제한이 있습니다. 정식 오픈 시에는 Resend 또는 SendGrid 같은 SMTP 서비스를 Supabase Auth에 연동하여 사용자 회원가입 이메일을 안정적으로 발송하세요.
3. **Connection Pooling 확인**
   - Next.js 서버리스 환경에서 수많은 유저가 동시에 접속하면 DB 커넥션이 고갈될 수 있습니다. 2026년 Supabase는 자체적인 IPv4/IPv6 Connection Pooling을 지원하므로, 배포 시 사용하는 `DATABASE_URL` 포트 번호가 `6543`(또는 풀러 포트)로 되어 있는지 확인하세요.

---

## 단계 3: 크롬 익스텐션 배포 (Chrome Web Store)
현재 "개발자 모드 압축 해제"로 사용 중인 확장 프로그램을 실제 고객들이 클릭 한 번으로 설치할 수 있게 크롬 웹 스토어에 등록합니다.

> [!WARNING] 
> 익스텐션 코드를 압축하기 전, `background.js`와 `content.js` 내에 API 통신 주소가 `http://localhost:3000`으로 하드코딩 되어 있다면, 단계 1에서 발급받은 **프로덕션 웹 도메인(예: https://myapp.vercel.app)으로 변경**해야 합니다!

1. **빌드 및 압축**
   - `src/extension/` 폴더 내의 파일들(`manifest.json`, `background.js`, `content.js`, 아이콘 등)만 선택하여 하나의 `extension.zip` 파일로 압축합니다.
2. **Google Chrome 개발자 대시보드 등록**
   - [Chrome 웹 스토어 개발자 대시보드](https://chrome.google.com/webstore/devconsole)에 로그인합니다. (최초 등록 시 $5 결제 필요)
3. **새 항목 추가**
   - `extension.zip` 파일을 업로드합니다.
4. **스토어 정보 입력 및 심사 요청**
   - 확장 프로그램 이름, 요약 설명(예: "SEO 블로그 자동화 도우미"), 스크린샷 1~2장을 등록합니다.
   - 개인정보처리방침(Privacy Policy) URL을 입력합니다. (노션 페이지로 대체 가능)
   - **심사 제출**: 구글 심사는 영업일 기준 보통 1~3일 정도 소요됩니다.

> [!TIP]
> 확장 프로그램을 대중에게 공개하지 않고, 결제한 회원(소상공인)에게만 링크로 제공하고 싶다면, 공개 상태 설정을 **'일부 공개(Unlisted)'**로 설정하세요. 검색에는 노출되지 않으며 링크를 아는 사람만 설치할 수 있습니다.

---

## 4. 최종 운영 테스트 (Sanity Check)
1. 크롬 웹 스토어에서 직접 익스텐션을 다운로드/설치합니다.
2. Vercel로 배포된 프로덕션 URL에 접속하여 구글 로그인 또는 회원가입을 진행합니다.
3. 프로필을 입력하고 대시보드에서 키워드를 생성합니다.
4. 에디터 렌더링 후 **[네이버로 복사하기 (Ctrl + V)]** 버튼을 눌러 실제 네이버 블로그에 글이 정상적으로 붙여넣어지는지 확인합니다.
