FROM node:20-alpine

RUN apk add --no-cache curl && \
    addgroup -S appgroup && \
    adduser -S appuser -G appgroup

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# データベース初期化スクリプトの権限設定
RUN chmod +x ./db/init/*.sql

EXPOSE 3001

ENV NODE_ENV=development \
    PORT=3001

USER appuser

CMD ["npm", "start"]
