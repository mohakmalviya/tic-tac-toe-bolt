#!/bin/bash

echo "🚀 Starting Tic-Tac-Toe Multiplayer Development Environment"
echo ""

# Function to kill background processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $SERVER_PID 2>/dev/null
    exit 0
}

# Set up trap to cleanup on exit
trap cleanup SIGINT SIGTERM

# Start the multiplayer server
echo "📡 Starting multiplayer server on port 3001..."
node server.js &
SERVER_PID=$!

# Wait a moment for server to start
sleep 2

# Check if server started successfully
if kill -0 $SERVER_PID 2>/dev/null; then
    echo "✅ Server started successfully!"
    echo "🔗 Server health check: http://localhost:3001/health"
    echo ""
    
    # Start Expo development server
    echo "📱 Starting Expo development server..."
    echo "📚 Scan QR code with Expo Go app or press 'w' for web"
    echo ""
    echo "💡 Tip: To test multiplayer, open the app on two devices/browsers"
    echo ""
    
    npx expo start
else
    echo "❌ Failed to start server"
    exit 1
fi

# This line will be reached when Expo server is stopped
cleanup 