# BASE Image
FROM node

# Create app directory
WORKDIR /usr/src/app

RUN npm install -g loopback-cli

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
