@echo off
title VeriLens RL — Python Forensics Backend
echo ===================================================
echo   VeriLens RL - Python FastAPI Forensics Server
echo ===================================================
echo Starting FastAPI server at http://127.0.0.1:8000 ...
cd /d "%~dp0"
py -3.13 -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
pause
