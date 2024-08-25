FROM node:latest

WORKDIR  /app/moneyMinder

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g http-server

EXPOSE 3001

ENTRYPOINT [ "http-server", "dist", "-p", "3001" ]
