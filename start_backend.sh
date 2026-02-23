#!/bin/bash
# Start Gunicorn from project root. Usage: ./start_backend.sh   or   nohup ./start_backend.sh > backend/gunicorn.log 2>&1 &
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT/backend" || { echo "Missing backend/ directory."; exit 1; }
chmod +x start_gunicorn.sh 2>/dev/null
exec ./start_gunicorn.sh
