@echo off
title AI Image Detector — Fullstack Development Mode
echo ===================================================================
echo     AI Image Detector: Fullstack Concurrent Development
echo       Backend (port 8000) + Vite Hot-Reload (port 5173)
echo ===================================================================
echo.

cd /d "%~dp0"

:: Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
)

echo Starting Backend and Frontend concurrently...
echo   - Frontend Vite HMR:  http://localhost:5173
echo   - Backend API Reload: http://127.0.0.1:8000
echo.

npm run fullstack
pause
