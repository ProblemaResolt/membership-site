FROM node:18-alpine

# ヘルスチェック用にwgetをインストール
RUN apk add --no-cache wget

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
