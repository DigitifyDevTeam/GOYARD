#!/bin/bash
set -e

echo "=== Deploying goyard-demenagement.fr ==="

# ── 1. Backend setup ──
echo ""
echo "[1/5] Loading environment..."
cd ~/GOYARD/backend
source load_env.sh

echo "[2/5] Installing Python dependencies..."
pip3 install -r requirements.txt

echo "[3/5] Running Django migrations & collecting static files..."
python3 manage.py migrate --noinput
python3 manage.py collectstatic --noinput

# ── 2. Frontend build ──
echo ""
echo "[4/5] Building frontend..."
cd ~/GOYARD/react
npm install
npm run build

# ── 3. Deploy to document root ──
echo ""
echo "[5/5] Deploying files to document root..."

# Adjust DOC_ROOT to your actual document root:
DOC_ROOT=~/public_html
# For a subdomain it might be: DOC_ROOT=~/goyard-demenagement.fr

# Copy frontend dist/ contents to document root
cp -r dist/* "$DOC_ROOT/"
cp -r dist/.* "$DOC_ROOT/" 2>/dev/null || true

# Copy .htaccess and passenger_wsgi.py to document root
cp ~/GOYARD/backend/.htaccess "$DOC_ROOT/.htaccess"
cp ~/GOYARD/backend/passenger_wsgi.py "$DOC_ROOT/passenger_wsgi.py"

# Restart Passenger (touch tmp/restart.txt to trigger reload)
mkdir -p "$DOC_ROOT/tmp"
touch "$DOC_ROOT/tmp/restart.txt"

echo ""
echo "=== Deployment complete! ==="
echo "Frontend: https://goyard-demenagement.fr"
echo "API:      https://goyard-demenagement.fr/api/"
echo "Admin:    https://goyard-demenagement.fr/admin/"
echo ""
echo "If Passenger is not set up yet, configure it via cPanel > Setup Python App"
echo "Then re-run this script."
