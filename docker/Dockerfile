FROM node:18.14-alpine as node

WORKDIR /app


FROM node as producer

COPY producer/*.json producer/yarn.lock /app/

RUN yarn install

copy producer /app

RUN yarn docker

CMD ["yarn", "dev"]


FROM node as consumer

COPY consumer/*.json consumer/yarn.lock /app/

RUN yarn install

copy consumer /app

RUN yarn docker

CMD ["yarn", "dev"]