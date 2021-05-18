## Install prod dependencies ##
FROM node:12.20.0-alpine AS dependencies
WORKDIR /app

RUN apk add --no-cache python3 make gcc g++
RUN npm i -g yarn@1.22.0; exit 0

ADD package.json package.json
ADD yarn.lock yarn.lock

RUN yarn --production

## Build/compilation stage (no-op but required by the standardised pipeline) ##
FROM dependencies AS build
# Skip me plz

## Run tests ##
FROM dependencies AS test

RUN yarn
ADD src src
ADD jest.config.js jest.config.js
ADD tsconfig.json tsconfig.json

RUN yarn test

## Assemble stage ##
FROM node:12.20.0-alpine AS assemble
WORKDIR /app

# Prod deps already installed
COPY --from=dependencies /app/node_modules node_modules

ADD package.json package.json
ADD yarn.lock yarn.lock

ADD src src
ADD server.ts server.ts
ADD schema.ts schema.ts
ADD load-story.ts load-story.ts
ADD tsconfig.server.json tsconfig.server.json
ADD angel-data angel-data

ENTRYPOINT ["yarn", "start"]
