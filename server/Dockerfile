# my-node-app/server/Dockerfile
FROM node:16

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install -g node-pre-gyp
RUN npm install --no-bin-links

# Install bcrypt specifically within Docker
RUN npm install bcrypt

# Install additional tools for development
RUN npm install -g nodemon

# Copy app source code
COPY . .

# Expose port (e.g., for Express API)
EXPOSE 5000

# Set environment variables for development
ENV NODE_ENV=development

# Start the server with nodemon for hot-reloading
CMD ["nodemon", "--watch", ".", "--exec", "node", "./src/index.mjs"]