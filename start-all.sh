#!/bin/bash

# GalaxiHire - Quick Start Script
# This script starts all services for local development

echo "🚀 Starting GalaxiHire Services..."
echo ""

# Check if required directories exist
if [ ! -d "backend" ] || [ ! -d "frontend" ] || [ ! -d "python-service" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for required tools
echo "📋 Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js not found. Please install Node.js"
    exit 1
fi

if ! command_exists python3 && ! command_exists python; then
    echo "❌ Python not found. Please install Python 3"
    exit 1
fi

echo "✅ Prerequisites OK"
echo ""

# Start MongoDB (if running locally)
# Uncomment if you have local MongoDB
# echo "Starting MongoDB..."
# mongod --fork --logpath /var/log/mongodb.log

# Start Python Service
echo "🐍 Starting Python Service on port 8000..."
cd python-service

if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt -q

uvicorn app:app --reload --port 8000 &
PYTHON_PID=$!
echo "✅ Python service started (PID: $PYTHON_PID)"
cd ..
echo ""

# Start Backend
echo "🔧 Starting Backend on port 4000..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

npm start &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"
cd ..
echo ""

# Start Frontend
echo "⚛️  Starting Frontend on port 3000..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"
cd ..
echo ""

echo "======================================"
echo "🎉 All services started successfully!"
echo "======================================"
echo ""
echo "Access your application:"
echo "  Frontend:  http://localhost:3000"
echo "  Backend:   http://localhost:4000"
echo "  Python:    http://localhost:8000"
echo ""
echo "Process IDs:"
echo "  Python:  $PYTHON_PID"
echo "  Backend: $BACKEND_PID"
echo "  Frontend: $FRONTEND_PID"
echo ""
echo "To stop all services, run:"
echo "  kill $PYTHON_PID $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Or press Ctrl+C and manually kill processes"
echo "======================================"

# Wait for user interrupt
wait
