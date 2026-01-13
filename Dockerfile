# Use official Node.js runtime
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Install dependencies in the backend-api directory
RUN cd packages/backend-api && npm install --production

# Build the application
RUN cd packages/backend-api && npm run build

# Expose port
EXPOSE 3001

# Start the application
CMD ["sh", "-c", "cd packages/backend-api && npm start"]