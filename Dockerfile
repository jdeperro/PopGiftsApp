# Use official Node.js runtime
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Install all dependencies (including dev dependencies for build)
RUN cd packages/backend-api && npm install

# Build the application
RUN cd packages/backend-api && npm run build

# Remove dev dependencies to reduce image size
RUN cd packages/backend-api && npm prune --production

# Expose port
EXPOSE 3001

# Start the application
CMD ["sh", "-c", "cd packages/backend-api && npm start"]