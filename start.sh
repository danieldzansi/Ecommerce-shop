#!/usr/bin/env bash
set -euo pipefail

# Start script for Railway / Railpack when repo contains multiple apps (frontend/backend)
# This script will attempt to detect an available Node package manager (npm/pnpm/yarn),
# install backend dependencies and start the backend server.

echo "Starting app via start.sh"
cd backend

# detect available package manager
PKG_MANAGER=""
if command -v npm >/dev/null 2>&1; then
	PKG_MANAGER="npm"
elif command -v pnpm >/dev/null 2>&1; then
	PKG_MANAGER="pnpm"
elif command -v yarn >/dev/null 2>&1; then
	PKG_MANAGER="yarn"
fi

if [ -z "${PKG_MANAGER}" ]; then
	echo "ERROR: No Node package manager found (npm, pnpm or yarn)."
	echo "Railpack environment may not have Node.js available."
	echo "Options:"
	echo "  1) Configure your Railway/Railpack project to use Node runtime so npm is available."
	echo "  2) Use a Docker deployment with Node installed."
	echo "  3) If you expect npm to exist, ensure the service uses the correct buildpack/runtime."
	exit 1
fi

echo "Using package manager: ${PKG_MANAGER}"

echo "Installing backend dependencies (production)..."
if [ "${PKG_MANAGER}" = "npm" ]; then
	npm ci --only=production || npm install --only=production
elif [ "${PKG_MANAGER}" = "pnpm" ]; then
	pnpm install --prod
else
	yarn install --production --frozen-lockfile || yarn install --production
fi

echo "Starting backend (node server.js)..."
# Prefer to run node directly to avoid requiring global CLI tools
if command -v node >/dev/null 2>&1; then
	node server.js
else
	echo "ERROR: Node.js runtime not found. Ensure Node is present in the environment."
	exit 1
fi
