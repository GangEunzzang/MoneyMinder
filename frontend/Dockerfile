FROM node:latest

WORKDIR /app/moneyMinder

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build --mode dev

EXPOSE 3001

CMD ["http-server", "dist", "-p", "3001"]