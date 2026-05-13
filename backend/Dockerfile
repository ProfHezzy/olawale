# Use a smaller image for production
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# Install only production dependencies
RUN npm install

# Copy all files
COPY . .

# Build the application
RUN npm run build

# Expose port 3001
EXPOSE 3001

# Start the production build
CMD ["npm", "run", "start:prod"]
