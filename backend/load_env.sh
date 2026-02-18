#!/bin/bash
# Production environment for goyard-demenagement.fr
# Usage: source load_env.sh

# Django
export DJANGO_SETTINGS_MODULE=core.settings.production
export DJANGO_ENV=production
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
export DJANGO_SECRET_KEY="J0UNZwQmnaSWOKQlfaumdKsmqwIF63iE5peYeWT8FFeTKGxtAatphQDswe0pJjttOlA"

# MySQL/MariaDB Database Configuration
export DB_NAME=qe2rfm_dev
export DB_USER=qe2rfm_dev
export DB_PASSWORD="Abra5687ca77dabra."
export DB_HOST=localhost
export DB_PORT=3306

# Allowed hosts
export ALLOWED_HOSTS=goyard-demenagement.fr,www.goyard-demenagement.fr

# CORS (no trailing slashes)
export CORS_ALLOW_ALL_ORIGINS=False
export CORS_ALLOWED_ORIGINS=https://goyard-demenagement.fr,https://www.goyard-demenagement.fr

# Google Maps API key
export GOOGLE_MAPS_API_KEY="AIzaSyBxtvdAKLEDoTLkVew4B2eFlH79SgYcHtU"

echo "Environment variables loaded for production"
