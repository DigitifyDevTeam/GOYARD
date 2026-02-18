#!/bin/bash

# Complete deployment script for Django production
# This script handles the entire deployment process

# Ensure this script is executable
if [ ! -x "$0" ]; then
    chmod +x "$0"
fi

echo "Starting Django production deployment..."

# Kill any existing Gunicorn processes
echo "Stopping existing Gunicorn processes..."
pkill -f gunicorn || true

# Wait a moment for processes to stop
sleep 2

# Check if any Gunicorn processes are still running
echo "Checking for remaining Gunicorn processes..."
ps aux | grep gunicorn || echo "No Gunicorn processes found"

# Make scripts executable
echo "Making scripts executable..."
chmod +x load_env.sh
chmod +x start_production.sh

# Load environment variables
echo "Loading environment variables..."
source load_env.sh

# Install/update dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Create logs directory if it doesn't exist
mkdir -p logs

# Start the production server
echo "Starting production server..."
nohup ./start_production.sh > logs/gunicorn.log 2>&1 &

echo "Deployment completed!"
echo "Check logs with: tail -f logs/gunicorn.log"
echo "Check processes with: ps aux | grep gunicorn"
