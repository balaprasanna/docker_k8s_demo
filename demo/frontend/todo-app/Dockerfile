# You should always specify a full version here to ensure all of your developers
# are running the same version of Node.
FROM node:7.8.0

# Override the base log level (info).
ENV NPM_CONFIG_LOGLEVEL warn

# Install and configure `serve`.
RUN npm install -g serve

# Install all dependencies of the current project.
COPY package*.json .
RUN npm install

# Copy all local files into the image.
COPY . .

# Build for production.
RUN npm run build --production

EXPOSE 80

CMD serve -s buil