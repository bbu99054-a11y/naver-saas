@echo off
chcp 65001 > nul
cls
echo ==================================================================
echo   🛑 PostSynk AI 다이렉트 엔진 즉시 종료
echo ==================================================================
echo.
echo 백그라운드에서 실행 중인 PostSynk 엔진(포트 49152)을 종료합니다...

powershell -NoProfile -ExecutionPolicy Bypass -Command "$proc = Get-NetTCPConnection -LocalPort 49152 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique; if ($proc) { Stop-Process -Id $proc -Force; Write-Host '[성공] PostSynk 엔진이 안전하게 종료되었습니다.' } else { Write-Host '[안내] 현재 실행 중인 엔진이 없습니다.' }"

echo.
timeout /t 2 > nul
