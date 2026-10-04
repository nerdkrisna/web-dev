@echo off
title ProjectHub Launcher
cd /d "%~dp0"

echo ====================================================
echo       Starting ProjectHub Full-Stack Application
echo ====================================================
echo Project Path: %cd%
echo.

:: 1. Check Backend dependencies
if not exist "%~dp0backend\node_modules" (
    echo [INFO] Backend dependencies not found. Installing now...
    cd /d "%~dp0backend"
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install backend dependencies.
        pause
        exit /b 1
    )
)

:: 2. Check Frontend dependencies
if not exist "%~dp0frontend\node_modules" (
    echo [INFO] Frontend dependencies not found. Installing now...
    cd /d "%~dp0frontend"
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install frontend dependencies.
        pause
        exit /b 1
    )
)

:: 3. Verify backend .env exists
if not exist "%~dp0backend\.env" (
    if exist "%~dp0backend\.env.example" (
        echo [INFO] backend\.env missing, copying from .env.example...
        copy "%~dp0backend\.env.example" "%~dp0backend\.env"
    )
)

echo.
echo [1/2] Launching Backend Server (Port 5000)...
start "ProjectHub - Backend (Port 5000)" cmd /k "cd /d ""%~dp0backend"" && npm run dev"

echo [2/2] Launching Frontend Vite Dev Server (Port 5173)...
start "ProjectHub - Frontend (Port 5173)" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

echo.
echo ====================================================
echo   ProjectHub servers are launching!
echo   - Backend API: http://localhost:5000
echo   - Frontend UI:  http://localhost:5173
echo ====================================================
echo Keep the Backend and Frontend command windows running while using the app.
timeout /t 5
