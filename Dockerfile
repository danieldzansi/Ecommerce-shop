### Dockerfile - builds and runs only the backend service
FROM node:18-alpine

# Create app directory and set working dir to backend
WORKDIR /usr/src/app/backend

# Install dependencies based on package-lock/package.json
# Copy package files first for better caching
COPY backend/package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy backend source
COPY backend/ ./

# Expose the port the app listens on (env PORT overrides at runtime)
EXPOSE 4000

# Use a non-root user for better security (optional)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Start the server
CMD ["npm", "start"]
