#!/bin/bash

# Load environment variables for production
export DJANGO_SETTINGS_MODULE=core.settings.production
export PYTHONPATH="${PYTHONPATH}:$(pwd)"

# Add any additional environment variables here
# Example:
# export DJANGO_SECRET_KEY="your-secret-key-here"
# export DB_NAME="your_database_name"
# export DB_USER="your_database_user"
# export DB_PASSWORD="your_database_password"
# export DB_HOST="localhost"
# export DB_PORT="3306"
# export ALLOWED_HOSTS="yourdomain.com,www.yourdomain.com"
# export CORS_ALLOWED_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"
# export GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

echo "Environment variables loaded for production"
