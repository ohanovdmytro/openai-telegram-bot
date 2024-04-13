FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN  npm run build

ENV PORT=3000

ENV OPENAI_API_KEY=

ENV BOT_API_KEY=

EXPOSE $PORT

CMD ["npm", "run", "start"]
