import os
import sys

# Path to this Django project on the server (Passenger / deploy scripts).
# Override if your clone is not ~/GOYARD/backend, e.g. export DJANGO_BACKEND_DIR=/home/user/GUIVARCHE/backend
BACKEND_DIR = os.path.abspath(
    os.environ.get('DJANGO_BACKEND_DIR', os.path.join(os.path.expanduser('~'), 'GOYARD', 'backend'))
)

if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.production')
os.environ.setdefault('DJANGO_ENV', 'production')

# Load secrets and domain config from backend/.env only (never commit real .env)
env_file = os.path.join(BACKEND_DIR, '.env')
if os.path.exists(env_file):
    with open(env_file, encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#') or '=' not in line:
                continue
            key, _, value = line.partition('=')
            key = key.replace('export ', '').strip()
            value = value.strip().strip('"').strip("'")
            os.environ.setdefault(key, value)

from django.core.wsgi import get_wsgi_application

application = get_wsgi_application()
