# API仕様書

## 認証系API

### ユーザー登録
- エンドポイント: `POST /api/auth/register`
- リクエスト:
```json
{
  "userId": "string (8-16文字, 英数字/_/-のみ)",
  "firstName": "string",
  "lastName": "string",
  "email": "string (メールアドレス形式)",
  "phone": "string (10-13文字の数字とハイフン)",
  "prefecture": "string",
  "city": "string",
  "address": "string",
  "password": "string (8文字以上)"
}
```
- レスポンス (201):
```json
{
  "message": "登録が完了しました",
  "userId": "string"
}
```

### ログイン
- エンドポイント: `POST /api/auth/login`
- リクエスト:
```json
{
  "userId": "string (メールアドレスも可)",
  "password": "string"
}
```
- レスポンス (200):
```json
{
  "token": "JWT token",
  "user": {
    "id": "number",
    "userId": "string",
    "firstName": "string",
    "lastName": "string",
    "role": "string"
  }
}
```

## チーム系API

### チーム作成
- エンドポイント: `POST /api/teams`
- 認証: 必要
- リクエスト:
```json
{
  "name": "string",
  "description": "string",
  "isPrivate": "boolean"
}
```

### チームメンバー招待
- エンドポイント: `POST /api/teams/invite`
- 認証: 必要
- リクエスト:
```json
{
  "teamId": "number",
  "userId": "string",
  "role": "enum ('admin', 'manager', 'user')"
}
```

## 投稿系API

### 投稿作成
- エンドポイント: `POST /api/posts`
- 認証: 必要
- リクエスト:
```json
{
  "content": "string",
  "teamId": "number (optional)",
  "visibility": "enum ('public', 'private', 'team')"
}
```

### 投稿一覧取得
- エンドポイント: `GET /api/posts`
- クエリパラメータ:
  - `teamId`: チーム投稿のフィルタリング
  - `page`: ページ番号
  - `limit`: 1ページの表示件数

## チャット系API

### メッセージ送信
- エンドポイント: `POST /api/chat`
- 認証: 必要
- リクエスト:
```json
{
  "content": "string",
  "teamId": "number (optional)",
  "parentId": "number (optional)"
}
```

### WebSocket接続
- エンドポイント: `ws://localhost:3001?token={jwt_token}`
- メッセージフォーマット:
```json
{
  "type": "string ('chat', 'notification')",
  "content": "any"
}
```

## 通知系API

### 通知一覧取得
- エンドポイント: `GET /api/notifications`
- 認証: 必要
- レスポンス:
```json
[
  {
    "id": "number",
    "type": "enum ('team_invite', 'message', 'post_mention')",
    "content": "string",
    "isRead": "boolean",
    "createdAt": "string (ISO8601)"
  }
]
```

## ファイルアップロードAPI

### ファイルアップロード
- エンドポイント: `POST /api/upload`
- 認証: 必要
- Content-Type: `multipart/form-data`
- フォームパラメータ:
  - `file`: アップロードするファイル
- レスポンス:
```json
{
  "url": "string (アップロードされたファイルのURL)"
}
```

## エラーレスポンス

全APIで共通のエラーレスポンス形式:
```json
{
  "error": "string (エラーメッセージ)",
  "code": "string (optional, エラーコード)"
}
```

## 認証

- 全APIリクエストで以下のヘッダーが必要:
  - `Authorization: Bearer {jwt_token}`
- トークンの有効期限: 24時間
- リフレッシュトークンの有効期限: 30日

## レート制限

- 認証済みユーザー: 100リクエスト/分
- 未認証ユーザー: 20リクエスト/分
- IPアドレスベースの制限: 1000リクエスト/時間
