@echo off
chcp 65001 > nul
title [PostSync] 퇴근/작업종료 - 깃허브 및 Vercel 배포 (Git Push)

echo =======================================================
echo   🚀 [PostSync] 작업 내용을 깃허브로 올리고 배포합니다
echo =======================================================
echo.

cd /d %~dp0

echo [1/4] 변경된 파일 목록 확인:
git status -s
echo.

set /p COMMIT_MSG=📝 변경 내용을 한 줄로 입력하세요 (엔터 치면 자동 입력): 
if %COMMIT_MSG%==" (
 set COMMIT_MSG=feat: update PostSync web app & tools
)

echo.
echo [2/4] 변경된 파일들을 추가합니다...
git add .

echo.
echo [3/4] 커밋 생성: %COMMIT_MSG%
git commit -m %COMMIT_MSG%

echo.
echo [4/4] 깃허브(origin/main)로 푸시합니다...
git push origin main

if %ERRORLEVEL% equ 0 (
 echo.
 echo =======================================================
 echo 🎉 깃허브 푸시 성공!
 echo ⚡ Vercel 실시간 프로덕션 자동 배포가 시작되었습니다.
 echo 🌐 서비스 접속: https://postsyncapp.com
 echo =======================================================
) else (
 echo.
 echo =======================================================
 echo ❌ 푸시 중 오류가 발생했습니다.
 echo 네트워크 상태나 깃허브 권한을 확인해 주세요.
 echo =======================================================
)

echo.
pause