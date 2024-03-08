# Use an official Node runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle app source inside the Docker image
COPY . .

# Build the app
RUN npm run build

# Install `serve` to run the application
RUN npm install -g serve

# The container will listen on port 80, aligning with Azure's default
EXPOSE 8000

# Command to run the app, specifying to serve on port 80
CMD ["serve", "-s", "build", "-l", "8000"]
