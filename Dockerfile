# At the moment Node.js 10.15.3 is the LTS version
# Alpine Linux is much smaller than most distribution base images
FROM node:10.15.3-alpine

# Create the 'app' and 'node_modules' directories
# Give ownership to the 'node' user and 'node' group
# ('node' user and group are created by default in node images)
RUN mkdir -p /usr/src/app/node_modules && chown -R node:node /usr/src/app

# Set the working directory in the docker image
WORKDIR /usr/src/app

# Copy package.json and package-lock.json if available
COPY package*.json ./

# You would want to run the container as an unprivileged user wherever possible.
USER node

# Install node dependencies
RUN yarn install

# Copy the source code form the working directory to the WORKDIR
# with the appropiate permissions
# (whatever is in the .dockerignore file will be ignored)
COPY --chown=node:node . .

# Document wich port will be used
EXPOSE 8080

# You can bypass the package.json's start command.
# First off this reduces the number of processes running inside of your container.
# Secondly it causes exit signals such as SIGTERM and SIGINT to be received by the Node.js process instead of npm swallowing them.
# See: https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#cmd
CMD [ "node", "index.js"]
