# my-node-app/client/Dockerfile
FROM node:16

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose port (e.g., for React)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev", "--", "--host"]