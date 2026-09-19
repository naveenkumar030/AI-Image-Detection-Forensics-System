@echo off
title AI Image Detector — Unified Fullstack System
echo ===================================================================
echo     AI Image Detector: Real vs AI Image Forensics System
echo          Combined Fullstack Server (React UI + Python Engine)
echo ===================================================================
echo.

cd /d "%~dp0"

:: Check if node_modules exists
if not exist "node_modules\" (
    echo [1/3] Installing frontend dependencies...
    call npm install
)

:: Check if dist exists
if not exist "dist\index.html" (
    echo [2/3] Building production frontend bundles...
    call npm run build
) else (
    echo [2/3] Frontend production bundle detected (dist/)...
)

echo [3/3] Starting Unified Server on http://127.0.0.1:8000 ...
echo.
echo ===================================================================
echo   - Web Application UI:     http://127.0.0.1:8000/
echo   - Interactive API Docs:   http://127.0.0.1:8000/docs
echo   - Health Check:           http://127.0.0.1:8000/api/health
echo ===================================================================
echo.

:: Automatically open default browser after 2 seconds
start "" powershell -NoProfile -Command "Start-Sleep -Seconds 2; Start-Process 'http://127.0.0.1:8000'"

:: Try py -3.13 first, then python
py -3.13 -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
if %errorlevel% neq 0 (
    echo Retrying with default python runner...
    python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
)

pause
