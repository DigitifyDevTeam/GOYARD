#!/bin/bash

# Production startup script for Django application with Gunicorn

# Set the Django settings module
export DJANGO_SETTINGS_MODULE=core.settings.production

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Run database migrations
echo "Running database migrations..."
python manage.py migrate

# Start Gunicorn server
echo "Starting Gunicorn server..."
gunicorn \
    --bind 0.0.0.0:8000 \
    --workers 4 \
    --worker-class sync \
    --timeout 120 \
    --max-requests 1000 \
    --max-requests-jitter 100 \
    --access-logfile - \
    --error-logfile - \
    --log-level info \
    core.wsgi:application
