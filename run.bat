@echo off
title ProjectHub Launcher
echo ====================================================
echo       Starting ProjectHub Full-Stack Application
echo ====================================================
echo.
echo [1/2] Starting Backend Server (Port 5000)...
start "ProjectHub - Backend (Port 5000)" cmd /k "cd backend && npm run dev"

echo [2/2] Starting Frontend Vite Dev Server (Port 5173)...
start "ProjectHub - Frontend (Port 5173)" cmd /k "cd frontend && npm run dev"

echo.
echo Servers have been launched in separate windows!
echo - Backend API: http://localhost:5000
echo - Frontend UI:  http://localhost:5173
echo.
echo Close those windows or press Ctrl+C in them whenever you want to stop the servers.
echo ====================================================
timeout /t 5
