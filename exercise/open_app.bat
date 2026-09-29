@echo off
title RunFit Coach Web Server
echo ========================================================
echo   Starting RunFit Coach Web Application...
echo   Opening in your default browser at http://localhost:3000
echo ========================================================
cd /d "%~dp0"
npm run dev
pause
