#!/bin/bash
# Run Gunicorn with env loaded.
# If ./start_gunicorn.sh says Permission denied (some hosts use noexec on $HOME): bash start_gunicorn.sh
# If you get exit 126: CRLF line endings — sed -i 's/\r$//' *.sh
# Only one Gunicorn on 8002 — before restart: pkill -f gunicorn
set -e
cd "$(dirname "$0")"
# shellcheck source=load_env.sh
source ./load_env.sh
exec python3 -m gunicorn --bind 0.0.0.0:8002 core.wsgi:application
