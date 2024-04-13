FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ENV PORT=3000

ENV GENERATE_SOURCEMAP=false
ENV NODE_OPTIONS=--max-old-space-size=6144

EXPOSE $PORT

CMD ["npm", "run", "start"]