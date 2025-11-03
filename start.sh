#!/usr/bin/env sh
# Start script for deployments that expect a shell entrypoint (Railpack, Heroku-like)
# It installs dependencies in the backend folder and starts the server.

set -e

echo "Starting backend deploy script..."

cd backend

if [ -f package-lock.json ]; then
  echo "Installing dependencies (npm ci)..."
  npm ci --only=production
else
  echo "Installing dependencies (npm install --production)..."
  npm install --production
fi

echo "Starting server using npm start"
npm start
