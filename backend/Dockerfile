FROM node:18

WORKDIR /app

COPY . .

WORKDIR /app/backend

RUN npm install

EXPOSE 3001

CMD ["node", "api/index.js"]
