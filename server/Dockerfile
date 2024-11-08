# my-node-app/server/Dockerfile
FROM node:16

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --no-bin-links

# Install bcrypt specifically within Docker
RUN npm install bcrypt

# Copy app source code
COPY . .

# Expose port (e.g., for Express API)
EXPOSE 5000

# Start the server
CMD ["node", "./src/index.mjs"]