# BASE Image
FROM node

# Create app directory
WORKDIR /usr/src/app

RUN npm i npm@latest -g

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
