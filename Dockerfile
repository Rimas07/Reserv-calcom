FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

RUN npm prune --omit=dev

ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/main"]
