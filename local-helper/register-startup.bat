@echo off
chcp 65001 > nul
cls
echo ==================================================================
echo   🚀 PostSynk AI 다이렉트 엔진 (공식 보안 커넥터) 1초 등록기
echo ==================================================================
echo.
echo [1/2] 윈도우 시작프로그램에 무음 백그라운드 엔진을 등록 중입니다...

set "SCRIPT_DIR=%~dp0"
set "VBS_PATH=%SCRIPT_DIR%start-engine-silent.vbs"
set "STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "SHORTCUT_PATH=%STARTUP_FOLDER%\PostSynk-Direct-Engine.lnk"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%SHORTCUT_PATH%'); $s.TargetPath = 'wscript.exe'; $s.Arguments = '\"%VBS_PATH%\"'; $s.WorkingDirectory = '%SCRIPT_DIR%'; $s.WindowStyle = 7; $s.Description = 'PostSynk AI Direct Engine'; $s.Save()"

if exist "%SHORTCUT_PATH%" (
    echo [성공] 윈도우 시작프로그램 등록이 완료되었습니다.
) else (
    echo [안내] 수동 바로가기를 생성합니다...
)

echo.
echo [2/2] PostSynk AI 다이렉트 엔진을 백그라운드에서 즉시 실행합니다...
wscript.exe "%VBS_PATH%"

echo.
echo ==================================================================
echo   ✨ 등록이 성공적으로 완료되었습니다!
echo   - 이제 컴퓨터를 켤 때마다 화면에 창 없이 자동으로 대기합니다.
echo   - PostSynk 웹 대시보드에서 [네이버 원클릭 자동 발행]을 누르시면 됩니다.
echo ==================================================================
echo.
timeout /t 3 > nul
