#!/bin/bash
# Production startup (foreground). Prefer start_gunicorn.sh or run_gunicorn_background.sh for typical hosting.
set -e
cd "$(dirname "$0")"
source ./load_env.sh

export DJANGO_SETTINGS_MODULE=core.settings.production

echo "Collecting static files..."
python3 manage.py collectstatic --noinput

echo "Running database migrations..."
python3 manage.py migrate --noinput

echo "Starting Gunicorn server..."
exec python3 -m gunicorn \
    --bind 0.0.0.0:8002 \
    --workers 4 \
    --worker-class sync \
    --timeout 120 \
    --max-requests 1000 \
    --max-requests-jitter 100 \
    --access-logfile - \
    --error-logfile - \
    --log-level info \
    core.wsgi:application
