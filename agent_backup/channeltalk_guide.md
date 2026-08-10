# 💬 채널톡(ChannelTalk) 플러그인 키 발급 및 적용 가이드

채널톡은 회원가입만 하면 무료로 챗봇 버튼을 달 수 있는 최고의 CS 툴입니다. 3분 안에 키를 발급받아 우리 SaaS에 연동하는 방법을 안내해 드립니다.

---

## 1단계: 채널톡 회원가입 및 채널 생성
1. **채널톡 공식 웹사이트**([https://channel.io/ko](https://channel.io/ko))에 접속합니다.
2. 우측 상단의 **[무료로 시작하기]** 버튼을 눌러 회원가입을 진행합니다.
3. 가입 후 **'새 채널 만들기'** 화면이 나오면, 채널 이름에 `PostSync (포스트싱크)`라고 입력하고 생성합니다.

## 2단계: Plugin Key (플러그인 키) 복사하기
1. 채널톡 관리자 화면(데스크앱 또는 웹) 좌측 하단의 ⚙️ **[채널 설정]** 톱니바퀴 아이콘을 클릭합니다.
2. 설정 메뉴 중 **[연동] -> [웹 설정]** (또는 `채널톡 버튼 설치`) 메뉴로 들어갑니다.
3. 화면에 **Plugin Key** 라고 적힌 영문/숫자 조합의 긴 문자열이 보입니다. (예: `1234abcd-5678-efgh-9012-3456ijklmnop`)
4. 해당 키 우측의 **[복사]** 버튼을 눌러 복사합니다.

## 3단계: 우리 SaaS 코드에 붙여넣기
대표님께서 키를 복사하셨다면, 현재 개발 중인 폴더에서 아래 파일을 엽니다.

- **수정할 파일 경로**: [`src/components/ChannelTalk.tsx`](file:///c:/workspace/naver_SaaS/src/components/ChannelTalk.tsx)
- 파일 내 **41번째 줄** 근처를 보시면 아래와 같은 코드가 있습니다.

```typescript
    const windowAny = window as any;
    windowAny.ChannelIO('boot', {
      pluginKey: 'YOUR_PLUGIN_KEY_HERE', // TODO: 대표님께서 발급받은 플러그인 키 입력
    });
```

여기서 `'YOUR_PLUGIN_KEY_HERE'` 부분을 지우고, 방금 복사하신 **실제 Plugin Key**를 따옴표(`''`) 안에 붙여넣습니다.

```typescript
    // 변경 후 예시
    const windowAny = window as any;
    windowAny.ChannelIO('boot', {
      pluginKey: '1234abcd-5678-efgh-9012-3456ijklmnop', 
    });
```

---

## 🎉 완료 및 테스트
저장을 누르시고(`Ctrl + S`), 브라우저(SaaS 화면)를 새로고침 해보세요.
화면 우측 하단에 채널톡 말풍선 아이콘 💬이 나타나면 성공입니다!

> [!TIP]
> 키를 발급받으신 뒤 **이 채팅창에 키를 그냥 복사해서 던져주시면**, 제가 직접 코드를 수정하고 깃허브에 배포까지 원스톱으로 처리해 드릴 수도 있습니다!
