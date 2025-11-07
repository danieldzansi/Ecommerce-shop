#!/usr/bin/env bash
set -euo pipefail

# Start script for Railway / Railpack when repo contains multiple apps (frontend/backend)
# This script installs backend dependencies and starts the backend server.

echo "Starting app via start.sh"
cd backend

echo "Installing backend dependencies (production)..."
npm install --production

echo "Starting backend..."
npm run start
