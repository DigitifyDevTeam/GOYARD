#!/bin/bash
# Run Gunicorn with env loaded. Use: ./start_gunicorn.sh   or   nohup ./start_gunicorn.sh > gunicorn.log 2>&1 &
cd "$(dirname "$0")"
source load_env.sh
exec python3 -m gunicorn --bind 0.0.0.0:8000 core.wsgi:application
