# Use an official Node.js runtime as the base image
FROM node:14-alpine

# Adding Envs
ENV RECAPTCHA_SECRET = "6Lf2jTcpAAAAAPvN__RncpdLr7VN5-8ysJGc_V1V"

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install


# Copy the rest of the app source code to the working directory
COPY . .



# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["node", "index.js"]