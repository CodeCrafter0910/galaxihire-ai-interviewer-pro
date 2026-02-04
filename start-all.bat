@echo off
REM GalaxiHire - Quick Start Script for Windows
REM This script starts all services for local development

echo.
echo ========================================
echo   Starting GalaxiHire Services
echo ========================================
echo.

REM Check if required directories exist
if not exist "backend" (
    echo Error: backend directory not found
    echo Please run this script from the project root
    pause
    exit /b 1
)

if not exist "frontend" (
    echo Error: frontend directory not found
    pause
    exit /b 1
)

if not exist "python-service" (
    echo Error: python-service directory not found
    pause
    exit /b 1
)

REM Start Python Service
echo.
echo [1/3] Starting Python Service on port 8000...
echo.
cd python-service
start cmd /k "title Python Service && echo Installing dependencies... && pip install -r requirements.txt && echo. && echo Python Service Running on http://localhost:8000 && echo. && uvicorn app:app --reload --port 8000"
cd ..
timeout /t 3 /nobreak >nul

REM Start Backend
echo.
echo [2/3] Starting Backend on port 4000...
echo.
cd backend
start cmd /k "title Backend API && echo Installing dependencies... && npm install && echo. && echo Backend Running on http://localhost:4000 && echo. && npm start"
cd ..
timeout /t 3 /nobreak >nul

REM Start Frontend
echo.
echo [3/3] Starting Frontend on port 3000...
echo.
cd frontend
start cmd /k "title Frontend (Next.js) && echo Installing dependencies... && npm install && echo. && echo Frontend Running on http://localhost:3000 && echo. && npm run dev"
cd ..

echo.
echo ========================================
echo   All services started!
echo ========================================
echo.
echo Three terminal windows have been opened:
echo  - Python Service (port 8000)
echo  - Backend API (port 4000)  
echo  - Frontend (port 3000)
echo.
echo Access your application at:
echo   http://localhost:3000
echo.
echo To stop services, close the terminal windows
echo or press Ctrl+C in each window.
echo ========================================
echo.
pause
