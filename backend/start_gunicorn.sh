#!/bin/bash
# Run Gunicorn with env loaded. Use: ./start_gunicorn.sh
# If you get "126": CRLF line endings — run: sed -i 's/\r$//' *.sh
set -e
cd "$(dirname "$0")"
# shellcheck source=load_env.sh
source ./load_env.sh
exec python3 -m gunicorn --bind 0.0.0.0:8002 core.wsgi:application
