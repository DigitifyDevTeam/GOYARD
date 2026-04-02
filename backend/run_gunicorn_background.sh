#!/bin/bash
# Start Gunicorn in the background. Run from backend: ./run_gunicorn_background.sh
set -e
cd "$(dirname "$0")"
source ./load_env.sh
nohup python3 -m gunicorn --bind 0.0.0.0:8002 core.wsgi:application >> gunicorn.log 2>&1 &
echo "Gunicorn started (PID $!). Use: tail -f gunicorn.log"
disown
echo "Disowned. Safe to close SSH — Gunicorn keeps running."
