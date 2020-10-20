FROM node:12

RUN apt-get update && apt-get install -y libasound2-dev

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

CMD [ "node", "index.js" ]
