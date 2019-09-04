FROM node:8

RUN mkdir /app

WORKDIR  /app

COPY ./package.json ./
COPY ./package-lock.json ./

ENV NPM_CONFIG_LOGLEVEL warn

RUN npm i

COPY ./ ./

RUN npm run build:ssr

EXPOSE 4000

CMD ["npm", "run", "serve:ssr"]