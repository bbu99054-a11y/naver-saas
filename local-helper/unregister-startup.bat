@echo off
chcp 65001 > nul
cls
echo ==================================================================
echo   🛑 PostSynk AI 다이렉트 엔진 시작프로그램 해제
echo ==================================================================
echo.

set "STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "SHORTCUT_PATH=%STARTUP_FOLDER%\PostSynk-Direct-Engine.lnk"

if exist "%SHORTCUT_PATH%" (
    del /f /q "%SHORTCUT_PATH%"
    echo [성공] 윈도우 시작프로그램에서 바로가기가 삭제되었습니다.
) else (
    echo [안내] 이미 시작프로그램에 등록되어 있지 않습니다.
)

echo.
echo 현재 실행 중인 PostSynk 엔진 프로세스를 종료하시겠습니까?
echo (종료하려면 아무 키나 누르시고, 취소하려면 창을 닫으세요.)
pause > nul

powershell -NoProfile -Command "Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like '*server.js*' } | Stop-Process -Force"

echo.
echo [완료] 해제 및 프로세스 종료가 완료되었습니다.
timeout /t 2 > nul
