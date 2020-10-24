# Use the official image as a parent image.
FROM node:current-slim

ENV NODE_ENV=production

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY . /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 8080
CMD [ "npm", "start" ]
# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .