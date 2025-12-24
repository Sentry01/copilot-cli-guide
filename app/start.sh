#!/bin/bash

# Start GitHub Copilot CLI Guide servers
# Usage: ./start.sh

cd "$(dirname "$0")"

echo "🚀 Starting GitHub Copilot CLI Guide..."
echo ""

# Kill any existing processes on our ports
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null

# Start backend server
echo "📦 Starting backend server (port 3000)..."
node server.js &
BACKEND_PID=$!

# Wait for backend to be ready
sleep 2

# Start frontend dev server
echo "⚡ Starting frontend server (port 5173)..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Servers started!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Handle shutdown
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo ''; echo '👋 Servers stopped'; exit" SIGINT SIGTERM

# Wait for processes
wait
