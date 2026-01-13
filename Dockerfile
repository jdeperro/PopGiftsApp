# Use official Node.js runtime
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY packages/backend-api/package*.json ./packages/backend-api/
COPY package*.json ./

# Install dependencies
RUN cd packages/backend-api && npm ci --only=production

# Copy source code
COPY packages/backend-api ./packages/backend-api

# Build the application
RUN cd packages/backend-api && npm run build

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start the application
CMD ["sh", "-c", "cd packages/backend-api && npm start"]