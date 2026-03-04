#!/bin/bash

# ============================================
#  PickOut - Full Stack Startup Script
#  Starts both Spring Boot backend (port 7090)
#  and React frontend (port 3000)
# ============================================

echo ""
echo "======================================"
echo "  🚀  PickOut - Starting Application"
echo "======================================"
echo ""

# Store root directory
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

# ---- Start Backend ----
echo "📦  Starting Spring Boot backend on port 7090..."
cd "$ROOT_DIR"
./mvnw spring-boot:run &
BACKEND_PID=$!

# Give the backend a moment to begin initializing
sleep 3

# ---- Start Frontend ----
echo "🎨  Starting React frontend on port 3000..."
cd "$ROOT_DIR/Frontend"
npx react-scripts start &
FRONTEND_PID=$!

echo ""
echo "======================================"
echo "  ✅  Both servers are starting!"
echo "  Backend:  http://localhost:7090"
echo "  Frontend: http://localhost:3000"
echo "======================================"
echo ""
echo "Press Ctrl+C to stop both servers."

# Trap Ctrl+C to kill both processes
cleanup() {
    echo ""
    echo "🛑  Shutting down..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    wait $BACKEND_PID 2>/dev/null
    wait $FRONTEND_PID 2>/dev/null
    echo "👋  PickOut stopped."
    exit 0
}

trap cleanup SIGINT SIGTERM

# Wait for both processes
wait
