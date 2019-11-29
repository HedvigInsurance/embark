FROM node:13.2.0-alpine
WORKDIR /usr/src/app

ADD package.json .
ADD package-lock.json .
RUN npm install --production

ADD . .

ENTRYPOINT ["npm", "run", "server"]
