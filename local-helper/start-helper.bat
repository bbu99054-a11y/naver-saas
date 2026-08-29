@echo off
chcp 65001 > nul
cls
echo ========================================================
echo   PostSynk Naver Local Helper is Running...
echo   (Keep this window open while using PostSynk SaaS)
echo ========================================================
echo.
node server.js
pause
