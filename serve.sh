#!/bin/bash

# DreamWaQ++ Local Development Server
# Usage: ./serve.sh [port]

PORT=${1:-8000}
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║   🤖 DreamWaQ++ Development Server                           ║"
echo "║                                                              ║"
echo "║   Local:   http://localhost:$PORT                              ║"
echo "║                                                              ║"
echo "║   Press Ctrl+C to stop the server                            ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

cd "$DIR"

# Try to open browser (works on most systems)
if command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:$PORT" 2>/dev/null &
elif command -v open &> /dev/null; then
    open "http://localhost:$PORT" 2>/dev/null &
fi

# Start Python HTTP server
python3 -m http.server "$PORT"


