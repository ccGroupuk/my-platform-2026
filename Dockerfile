FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY server.js ./

# Expose port
ENV PORT=8080
EXPOSE 8080

# Start command
CMD ["node", "server.js"]
