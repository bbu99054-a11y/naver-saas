# Phase 6: 실사 이미지(Unsplash API) 연동 및 신뢰도 향상 플랜

안녕하세요 대표님! AI가 생성한 어색한 가짜 이미지 대신, 변호사/세무사 블로그의 신뢰도를 극대화할 수 있는 **100% 고화질 실사 사진(Unsplash) 자동 삽입 기능** 도입 플랜입니다.

## 🎯 목표 (Goal)
- Pollinations AI 이미지 생성 기능을 제거하고, **Unsplash API**를 활용한 고품질 실사 스톡 이미지(법정, 계약서, 악수, 세무서 등)를 자동 삽입합니다.
- AI가 글의 문맥을 파악해 적절한 키워드(예: 'lawyer', 'tax', 'handshake')를 추출하고, 해당 키워드와 매칭되는 최상급 사진을 불러옵니다.

---

## ⚠️ User Review Required (중요 확인 사항)
> [!IMPORTANT]
> Unsplash API를 연동하려면 대표님 전용 API Key가 필요합니다. 개발 착수와 함께 아래 작업을 진행해 주셔야 합니다!
> 
> **[Unsplash API 발급 및 설정 방법]**
> 1. https://unsplash.com/developers 에 접속 및 회원가입
> 2. `New Application` 생성 후 **"Access Key"** 복사
> 3. Vercel 대시보드 -> Settings -> Environment Variables 이동
> 4. `UNSPLASH_ACCESS_KEY` 라는 이름으로 복사한 Key 값을 붙여넣고 저장 및 재배포(Redeploy)

---

## 🛠️ Proposed Changes (변경 예정 사항)

### 1. 이미지 중계 서버 (Proxy API) 신설
#### [NEW] `src/app/api/unsplash/route.ts`
- **역할**: AI가 바로 Unsplash API를 호출하면 보안 키(Key)가 유출되거나 에러가 날 수 있습니다. 따라서 자체 중계 API를 만듭니다.
- **작동 원리**: 글 본문 안의 이미지 태그가 `/api/unsplash?query=lawyer` 형태로 호출되면, 이 API 서버가 Unsplash 서버에서 몰래 진짜 고화질 사진 URL을 받아와서 브라우저로 쏴줍니다(HTTP 302 Redirect). 이 방식은 네이버 에디터 복사 붙여넣기 시에도 사진이 100% 깔끔하게 복사되도록 돕습니다.

### 2. AI 시스템 프롬프트 개편
#### [MODIFY] `src/app/api/generate-seo/route.ts`
- `<html_constraints>` 태그 수정: 
  - 기존 Pollinations 이미지 태그 룰셋을 삭제합니다.
  - 신규 룰셋: 본문에 실사 사진이 필요한 위치에 `<img src="https://naver-saas.vercel.app/api/unsplash?query={문맥에_맞는_영문명사}" ...>` 코드를 삽입하도록 AI에게 지시합니다.

---

## 🧪 Verification Plan (검증 계획)
- **Manual Verification**: 
  1. 제가 개발을 마친 후, 대표님께서 Vercel에 API Key를 등록하시면 즉시 테스트가 가능합니다.
  2. "이혼 소송" 등의 키워드로 글을 생성했을 때, HTML 미리보기 화면에 법원(court), 변호사(lawyer) 등의 고화질 실사 사진이 노출되는지 확인합니다.
  3. 네이버 블로그로 복사 붙여넣기를 했을 때 사진이 엑스박스 없이 엑설런트하게 옮겨지는지 점검합니다.

> [!TIP]
> 우측 기획서를 꼼꼼히 확인해 주시고, **[Proceed(진행)]** 버튼을 눌러주시면 즉시 코드 개발에 착수하겠습니다! 
> (Proceed를 누르신 후, 천천히 Unsplash API 발급을 진행해 주시면 됩니다!)
