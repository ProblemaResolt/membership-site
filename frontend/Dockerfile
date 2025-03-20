FROM node:20-alpine

RUN apk add --no-cache curl

WORKDIR /app

# 依存関係のインストール
COPY package*.json ./
RUN npm install

# ソースコードをコピーしてTailwindCSSの設定ファイルを生成
COPY . .

EXPOSE 3000

ENV NODE_ENV=development

CMD ["npm", "start", "--", "--host", "0.0.0.0"]
