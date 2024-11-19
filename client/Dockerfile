# my-node-app/client/Dockerfile
FROM node:18

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Install additional tools for developement
RUN npm install -g nodemon

# Expose port (e.g., for React)
EXPOSE 3000

# Set environment variables for development
ENV NODE_ENV=development

# Start the application
CMD ["npm", "run", "dev", "--", "--host"]