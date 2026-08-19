# 🏁 사업자 정보(와이엠랩스) 및 도메인(postsyncapp.com) 적용 결과 보고

대표님의 사업자등록증(와이엠랩스) 정보와 구매하신 도메인(`postsyncapp.com`) 및 공식 이메일(`bu99054@naver.com`)을 바탕으로 서비스 런칭 필수 법적/인프라 설정을 완료했습니다.

---

## 1. 변경 및 적용 내역

### 1) 랜딩 페이지 하단 푸터 (Footer) 전면 개편 ([page.tsx](file:///c:/workspace/naver_SaaS_Copy_For_USB/src/app/page.tsx))
- **상호명:** 와이엠랩스 (YM Labs)
- **대표자:** 유영무
- **사업자등록번호:** 736-48-01186 ([공정거래위원회 사업자정보조회](https://www.ftc.go.kr/bizCommPop.do?wrkr_no=7364801186) 팝업 연결)
- **사업장 주소:** 서울특별시 송파구 송파대로 345, 103동 204호(가락동, 헬리오시티)
- **고객센터 / 공식 이메일:** `bu99054@naver.com`
- **호스팅 서비스:** Vercel Inc.
- **개인정보보호책임자:** 유영무 (bu99054@naver.com)
- **통신판매업신고:** 신고 준비 중 (신고 완료 즉시 번호 갱신)
- **법적 면책 고지:** AI 생성 콘텐츠 책임 및 검토 의무 문구 반영

### 2) 2026년 정식 서비스 이용약관 완성 ([terms/page.tsx](file:///c:/workspace/naver_SaaS_Copy_For_USB/src/app/terms/page.tsx))
- 와이엠랩스 및 `postsyncapp.com` 기준 제 1 조 ~ 제 8 조 구성
- 토스페이먼츠 심사 기준에 맞춘 **미사용 크레딧 7일 이내 전액 환불 및 정산 환불 규정(제 5 조)** 명시
- **전문직 광고 규제 준수 및 AI 생성물 검토 의무(제 6 조)** 명시

### 3) 2026년 정식 개인정보처리방침 완성 ([privacy/page.tsx](file:///c:/workspace/naver_SaaS_Copy_For_USB/src/app/privacy/page.tsx))
- 수집 항목, 보유/파기 기간(전자상거래법 기준 5년 등) 표기
- 클라우드 및 AI 인프라 수탁사(Supabase, Vercel, 토스페이먼츠, OpenAI/Anthropic) 국외/국내 이전 내역 명시
- 개인정보보호책임자: 유영무 대표 (`bu99054@naver.com`)

### 4) 사이트 메타데이터 및 SEO 최적화 ([layout.tsx](file:///c:/workspace/naver_SaaS_Copy_For_USB/src/app/layout.tsx))
- `metadataBase: new URL('https://postsyncapp.com')` 설정
- Canonical URL 및 OpenGraph 링크를 `https://postsyncapp.com`으로 일치화

---

## 2. 빌드 및 안정성 검증 결과

- **실행 명령:** `next build` (Next.js 16 Turbopack)
- **결과:** **31개 전체 라우트 빌드 성공 (Compiled successfully in 14.9s / Exit Code 0)**
- **오류 발생 여부:** 없음

---

## 3. 대표님께서 직접 진행하실 외부 설정 가이드 (체크리스트)

### A. Vercel 도메인 연결 (5분 소요)
1. **[Vercel Dashboard](https://vercel.com)** 접속 ➔ PostSync 프로젝트 선택 ➔ **Settings** ➔ **Domains** 클릭
2. `postsyncapp.com` 및 `www.postsyncapp.com` 입력 후 **Add** 클릭
3. 도메인을 구매하신 사이트(가비아, 후이즈, 네임칩, Cloudflare 등)의 **DNS 레코드 관리**에서 아래 정보 입력:
   - **Type:** `A` | **Name:** `@` | **Value:** `76.76.21.21` (Vercel 기본 IP)
   - **Type:** `CNAME` | **Name:** `www` | **Value:** `cname.vercel-dns.com`
4. 10~30분 후 SSL 인증서가 자동 발급되어 `https://postsyncapp.com`으로 접속됩니다.

### B. Supabase Auth URL 설정 (2분 소요)
1. **[Supabase Dashboard](https://supabase.com)** 접속 ➔ 프로젝트 선택 ➔ **Authentication** ➔ **URL Configuration**
2. **Site URL:** `https://postsyncapp.com` 으로 변경
3. **Redirect URLs:** 아래 2개 주소 추가 후 Save:
   - `https://postsyncapp.com/**`
   - `https://postsyncapp.com/auth/callback`

### C. 통신판매업 신고 및 토스페이먼츠 심사 신청
1. **정부24**에서 [통신판매업 신고] 진행 (사업자등록증 첨부)
2. **토스페이먼츠** 가맹점 계약 신청서에 사이트 URL(`https://postsyncapp.com`) 입력 및 심사 요청
