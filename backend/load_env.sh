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
while IFS= read -r line || [ -n "$line" ]; do
    # Strip CR (Windows line endings) and skip empty lines
    line="${line%$'\r'}"
    [[ -z "$line" ]] && continue
    # Skip comment lines
    [[ "$line" == \#* ]] && continue
    # Skip lines without '=' (invalid format)
    [[ "$line" != *=* ]] && continue
    # Split on first '=' only
    key="${line%%=*}"
    value="${line#*=}"
    # Trim whitespace from key; skip if key is empty after trim
    key="$(echo "$key" | xargs)"
    [[ -z "$key" ]] && continue
    # Export the variable
    export "$key=$value"
done < "$ENV_FILE"
set +a

# Always set these derived variables
export DJANGO_ENV=production
export PYTHONPATH="${PYTHONPATH}:${SCRIPT_DIR}"

echo "Environment variables loaded from ${ENV_FILE} for production"
