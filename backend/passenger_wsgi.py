import os
import sys

# When this file is in the document root, BACKEND_DIR points to the Django project
BACKEND_DIR = os.path.expanduser('~/GOYARD/backend')

if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

# Try to load .env from the backend directory
env_file = os.path.join(BACKEND_DIR, '.env')
if os.path.exists(env_file):
    with open(env_file) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#') or '=' not in line:
                continue
            key, _, value = line.partition('=')
            key = key.replace('export ', '').strip()
            value = value.strip().strip('"').strip("'")
            os.environ.setdefault(key, value)

# Fallback defaults (used if .env is missing)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.production')
os.environ.setdefault('DJANGO_ENV', 'production')
os.environ.setdefault('DJANGO_SECRET_KEY', 'J0UNZwQmnaSWOKQlfaumdKsmqwIF63iE5peYeWT8FFeTKGxtAatphQDswe0pJjttOlA')
os.environ.setdefault('DB_NAME', 'qe2rfm_dev')
os.environ.setdefault('DB_USER', 'qe2rfm_dev')
os.environ.setdefault('DB_PASSWORD', 'Abra5687ca77dabra.')
os.environ.setdefault('DB_HOST', 'localhost')
os.environ.setdefault('DB_PORT', '3306')
os.environ.setdefault('ALLOWED_HOSTS', 'goyard-demenagement.fr,www.goyard-demenagement.fr')
os.environ.setdefault('CORS_ALLOWED_ORIGINS', 'https://goyard-demenagement.fr,https://www.goyard-demenagement.fr')
os.environ.setdefault('GOOGLE_MAPS_API_KEY', 'AIzaSyBxtvdAKLEDoTLkVew4B2eFlH79SgYcHtU')

from django.core.wsgi import get_wsgi_application

application = get_wsgi_application()
