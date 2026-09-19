#!/usr/bin/env python3
"""
AI Image Detector — Unified Fullstack Runner
Launches the combined system (FastAPI backend serving the React production UI).
Can also run both in concurrent development mode with --dev.

Usage:
    python run.py             # Run combined server on http://127.0.0.1:8000
    python run.py --dev       # Run concurrent dev mode (Vite 5173 + FastAPI 8000)
    python run.py --build     # Force rebuild frontend before starting
    python run.py --port 8080 # Custom port
"""

import sys
import os
import subprocess
import argparse
import webbrowser
import threading
import time
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
DIST_DIR = ROOT_DIR / "dist"

if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))
os.chdir(str(ROOT_DIR))

def build_frontend():
    """Compiles the React frontend using npm run build."""
    print("[AI-Detector] Building React frontend bundles (npm run build)...")
    cmd = ["npm", "run", "build"]
    if sys.platform == "win32":
        cmd = ["cmd", "/c", "npm", "run", "build"]
    ret = subprocess.run(cmd, cwd=str(ROOT_DIR))
    if ret.returncode != 0:
        print("[AI-Detector] Error: Frontend build failed.")
        sys.exit(ret.returncode)
    print("[AI-Detector] Frontend successfully built to dist/.")

def open_browser(url, delay=1.5):
    """Opens browser after server startup."""
    def _open():
        time.sleep(delay)
        print(f"[AI-Detector] Opening browser at {url} ...")
        webbrowser.open(url)
    threading.Thread(target=_open, daemon=True).start()

def run_dev():
    """Runs concurrently npm run fullstack."""
    print("[AI-Detector] Starting Fullstack Concurrent Dev Mode...")
    cmd = ["npm", "run", "fullstack"]
    if sys.platform == "win32":
        cmd = ["cmd", "/c", "npm", "run", "fullstack"]
    subprocess.run(cmd, cwd=str(ROOT_DIR))

def run_combined(host="127.0.0.1", port=8000, reload=False, auto_open=True):
    """Runs FastAPI serving both API and static frontend."""
    if not (DIST_DIR / "index.html").exists():
        print("[AI-Detector] 'dist/index.html' not found. Automatically building frontend...")
        build_frontend()

    url = f"http://{host}:{port}"
    print("=" * 65)
    print("  AI Image Detector: Real vs AI Image Forensics System")
    print("  Combined Fullstack Engine Active")
    print("=" * 65)
    print(f"  * Web Application UI:     {url}/")
    print(f"  * Interactive API Docs:   {url}/docs")
    print(f"  * Health Check Endpoint:  {url}/api/health")
    print("=" * 65)

    if auto_open:
        open_browser(url)

    import uvicorn
    uvicorn.run("backend.main:app", host=host, port=port, reload=reload)

def main():
    parser = argparse.ArgumentParser(description="AI Image Detector Fullstack Launcher")
    parser.add_argument("--dev", action="store_true", help="Run concurrent dev mode (Vite + FastAPI reload)")
    parser.add_argument("--build", action="store_true", help="Force rebuild React frontend before starting")
    parser.add_argument("--host", default="127.0.0.1", help="Server host (default: 127.0.0.1)")
    parser.add_argument("--port", type=int, default=8000, help="Server port (default: 8000)")
    parser.add_argument("--no-browser", action="store_true", help="Do not auto-launch browser")
    parser.add_argument("--reload", action="store_true", help="Enable uvicorn auto-reload")
    args = parser.parse_args()

    if args.build:
        build_frontend()

    if args.dev:
        run_dev()
    else:
        run_combined(
            host=args.host,
            port=args.port,
            reload=args.reload,
            auto_open=not args.no_browser
        )

if __name__ == "__main__":
    main()
