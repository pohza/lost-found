#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:3000}"
API_URL="${BASE_URL%/}/api"

echo "Running smoke tests against: ${BASE_URL}"

health_code="$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/health")"
if [[ "${health_code}" != "200" ]]; then
  echo "FAIL: /health returned ${health_code}"
  exit 1
fi
echo "OK: /health"

items_code="$(curl -s -o /dev/null -w "%{http_code}" "${API_URL}/items")"
if [[ "${items_code}" != "200" ]]; then
  echo "FAIL: /api/items returned ${items_code}"
  exit 1
fi
echo "OK: /api/items"

auth_code="$(curl -s -o /dev/null -w "%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -d '{}' \
  "${API_URL}/auth/login")"
if [[ "${auth_code}" != "400" && "${auth_code}" != "401" ]]; then
  echo "FAIL: /api/auth/login validation/auth behavior unexpected (${auth_code})"
  exit 1
fi
echo "OK: /api/auth/login validation/auth"

echo "Smoke tests passed."
