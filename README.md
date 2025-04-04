# メンバーシップサイト

## 概要
このプロジェクトは、チーム管理、投稿、チャット機能を備えたメンバーシップサイトです。
TypeScript、React、Express、PostgreSQL、Redisを使用した、モダンなウェブアプリケーションです。

## 機能要件

### 1. 認証機能
- ユーザー登録
  - メールアドレス、ユーザーID、パスワード必須
  - プロフィール情報（名前、住所等）の登録
- ログイン/ログアウト
  - JWT認証
  - セッション管理
- パスワードリセット
- メール認証
- OAuth認証（Google, GitHub）

### 2. チーム機能
- チーム作成/管理
  - 公開/非公開設定
  - メンバー招待
  - 権限管理（admin, manager, user）
- チームチャット
  - WebSocketによるリアルタイム通信
  - スレッド機能

### 3. 投稿機能
- 投稿作成/編集/削除
- 公開範囲設定（public, private, team）
- AIモデレーション（OpenAI API使用）
- ファイルアップロード

### 4. 通知機能
- チーム招待通知
- メンション通知
- メッセージ通知
- メール通知

## 技術スタック

### フロントエンド
- React
- TypeScript
- Vite
- TailwindCSS
- React Router
- WebSocket (ws)

### バックエンド
- Express
- TypeScript
- Sequelize (PostgreSQL)
- Redis
- WebSocket
- JSON Web Tokens
- Passport.js

### インフラ
- Docker/Docker Compose
- Nginx
- PostgreSQL
- Redis

## データベース設計

### Users
```sql
CREATE TABLE Users (
  id SERIAL PRIMARY KEY,
  userId VARCHAR(16) UNIQUE NOT NULL,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(255) NOT NULL,
  prefecture VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  isEmailVerified BOOLEAN DEFAULT false,
  role ENUM('admin', 'manager', 'user') DEFAULT 'user'
);
```

### Teams
```sql
CREATE TABLE Teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  createdBy INTEGER REFERENCES Users(id),
  isPrivate BOOLEAN DEFAULT false
);
```

### TeamMembers
```sql
CREATE TABLE TeamMembers (
  TeamId INTEGER REFERENCES Teams(id),
  UserId INTEGER REFERENCES Users(id),
  role ENUM('admin', 'manager', 'user') DEFAULT 'user',
  PRIMARY KEY (TeamId, UserId)
);
```

### Posts
```sql
CREATE TABLE Posts (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  userId INTEGER REFERENCES Users(id),
  teamId INTEGER REFERENCES Teams(id),
  visibility ENUM('public', 'private', 'team') DEFAULT 'public',
  isApproved BOOLEAN DEFAULT false,
  moderationScore FLOAT
);
```

## セキュリティ対策
- CSRF対策
- XSS対策
- Rate Limiting
- セキュアセッション管理
- パスワードハッシュ化
- 入力バリデーション

## 環境構築
1. リポジトリのクローン
2. 環境変数の設定
3. Dockerコンテナの起動
4. データベースのマイグレーション

### 開発環境の起動
```bash
docker-compose up --build
```

### マイグレーションの実行
```bash
docker-compose exec backend npm run migrate
```

## API仕様
詳細なAPI仕様は[API.md](./API.md)を参照してください。
