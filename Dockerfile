FROM node:12.20.0-alpine
WORKDIR /usr/src/app

RUN apk add --no-cache python3 make gcc g++
RUN npm i -g yarn@1.22.0

ADD package.json .
ADD yarn.lock .
RUN yarn --production

ADD . .

ENTRYPOINT ["yarn", "start"]
