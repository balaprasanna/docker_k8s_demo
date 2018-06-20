FROM mhart/alpine-node:6.8.0

WORKDIR /src
COPY ./api/ .

# install node.js modules
RUN npm install

CMD ["npm", "start"]