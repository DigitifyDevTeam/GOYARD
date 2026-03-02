#!/bin/bash
# Production environment loader for goyard-demenagement.fr
# Usage:
#   chmod +x load_env.sh    (once)
#   source load_env.sh       (each time you start the server)
#
# Reads KEY=VALUE pairs from .env in the same directory and exports them.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env"

if [ ! -f "$ENV_FILE" ]; then
    echo "ERROR: .env file not found at ${ENV_FILE}"
    echo "Copy .env.example to .env and fill in your values."
    return 1 2>/dev/null || exit 1
fi

set -a
while IFS='=' read -r key value; do
    # Skip empty lines and comments
    [[ -z "$key" || "$key" == \#* ]] && continue
    # Trim leading/trailing whitespace from key
    key="$(echo "$key" | xargs)"
    # Export the variable (value keeps everything after the first '=')
    export "$key=$value"
done < "$ENV_FILE"
set +a

# Always set these derived variables
export DJANGO_ENV=production
export PYTHONPATH="${PYTHONPATH}:${SCRIPT_DIR}"

echo "Environment variables loaded from ${ENV_FILE} for production"
