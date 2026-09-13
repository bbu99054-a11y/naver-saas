# 🚀 PostSync 모노레포 동기화 & 배포 가이드 (회사 ↔ 집)

본 저장소는 **PostSync AI 플랫폼의 메인 웹 SaaS, 무료 웹툴 7종, 도메인/서브도메인 라우팅**을 총괄하는 핵심 배포 저장소입니다.

---

## 1. 🔄 일상 작업 루틴 (회사 & 집 동일)

### ① 작업 시작할 때 (출근 또는 집에서 노트북 켤 때)
* **1_PULL_최신코드받기.bat** 더블 클릭!
* 다른 컴퓨터에서 작업해 깃허브에 올려둔 최신 코드를 1초 만에 내려받습니다.

### ② 작업 끝마칠 때 (퇴근 또는 집에서 작업 마칠 때)
* **2_PUSH_작업내용올리기.bat** 더블 클릭!
* 오늘 작업한 내용이 깃허브 origin/main으로 푸시되고, **Vercel 실시간 배포가 자동 시작**됩니다.
* 접속 확인: https://postsyncapp.com

---

## 2. 💻 새 컴퓨터(회사 PC or 집 노트북) 최초 1회 세팅법

만약 한쪽 컴퓨터에 아직 이 폴더가 없다면, 터미널(Git Bash 또는 CMD)에서 딱 한 번만 아래 명령어를 실행하세요:

`ash
cd C:\workspace
git clone https://github.com/bbu99054-a11y/naver-saas.git postsync
cd postsync
npm install
`

> **🔑 중요: 환경변수(.env.local)**  
> .env.local 파일은 보안상 깃허브에 올라가지 않습니다.  
> 기존 컴퓨터에 있는 C:\workspace\postsync\.env.local 파일 내용을 복사하여 새 컴퓨터의 C:\workspace\postsync\.env.local에 그대로 붙여넣어 주세요.

---

## 3. 📁 프로젝트 핵심 폴더 안내

* **src/app/**: Next.js 16 풀스택 웹 SaaS (대시보드, 에디터, 결제, API)
* **public/**: 무료 웹툴 7종 (/place, /crop, /adcheck, /byte, /hwpx, /utm, /convert)
  * 웹툴을 수정할 때는 이제 다른 폴더에서 복사할 필요 없이 public/*.html을 바로 수정하시면 됩니다.
* **
ext.config.ts**: 도메인 및 서브도메인(예: crop.postsyncapp.com) 리라이트 설정
* **prisma/**: PostgreSQL / Supabase 데이터베이스 스키마