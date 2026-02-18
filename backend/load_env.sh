#!/bin/bash
# Production environment for goyard-demenagement.fr
# Usage: source load_env.sh

# Django
export DJANGO_SETTINGS_MODULE=core.settings.production
export DJANGO_ENV=production
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
export DJANGO_SECRET_KEY="J0UNZwQmnaSWOKQlfaumdKsmqwIF63iE5peYeWT8FFeTKGxtAatphQDswe0pJjttOlA"

# MySQL/MariaDB Database Configuration
export DB_NAME=121iq1_guivarchebd
export DB_USER=121iq1_uivarchea
export DB_PASSWORD="hMN1Zb4FnvTTfXg!"
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
