# Use Node.js image
FROM node:22.15.0

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy all project files
COPY . .

# Expose port
EXPOSE 8080

# Start app
CMD ["npm", "start"]