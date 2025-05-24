FROM node:18

WORKDIR /app

COPY backend ./backend
COPY .env ./

WORKDIR /app/backend

RUN npm install

EXPOSE 3001

CMD ["node", "api/index.js"]
