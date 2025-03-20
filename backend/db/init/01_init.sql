CREATE TYPE user_role AS ENUM ('admin', 'manager', 'user');
CREATE TYPE post_visibility AS ENUM ('public', 'private', 'team');
CREATE TYPE notification_type AS ENUM ('team_invite', 'message', 'post_mention');
CREATE TYPE oauth_provider AS ENUM ('google', 'github');

CREATE TABLE IF NOT EXISTS "Users" (
  "id" SERIAL PRIMARY KEY,
  "userId" VARCHAR(16) UNIQUE NOT NULL,
  "firstName" VARCHAR(255) NOT NULL,
  "lastName" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "phone" VARCHAR(255) NOT NULL,
  "prefecture" VARCHAR(255) NOT NULL,
  "city" VARCHAR(255) NOT NULL,
  "address" VARCHAR(255) NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "isEmailVerified" BOOLEAN DEFAULT false,
  "role" user_role DEFAULT 'user',
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "resetToken" VARCHAR(255),
  "resetTokenExpires" TIMESTAMP WITH TIME ZONE,
  "lastLoginAt" TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS "Teams" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) UNIQUE NOT NULL,
  "description" TEXT,
  "createdBy" INTEGER REFERENCES "Users"("id") ON DELETE CASCADE,
  "isPrivate" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS "TeamMembers" (
  "TeamId" INTEGER REFERENCES "Teams"("id") ON DELETE CASCADE,
  "UserId" INTEGER REFERENCES "Users"("id") ON DELETE CASCADE,
  "role" user_role DEFAULT 'user',
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  PRIMARY KEY ("TeamId", "UserId")
);

CREATE TABLE IF NOT EXISTS "Posts" (
  "id" SERIAL PRIMARY KEY,
  "content" TEXT NOT NULL,
  "userId" INTEGER REFERENCES "Users"("id") ON DELETE CASCADE,
  "teamId" INTEGER REFERENCES "Teams"("id") ON DELETE SET NULL,
  "visibility" post_visibility DEFAULT 'public',
  "isApproved" BOOLEAN DEFAULT false,
  "moderationScore" FLOAT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS "Notifications" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER REFERENCES "Users"("id") ON DELETE CASCADE,
  "type" notification_type NOT NULL,
  "content" TEXT NOT NULL,
  "isRead" BOOLEAN DEFAULT false,
  "relatedId" INTEGER,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS "Chats" (
  "id" SERIAL PRIMARY KEY,
  "content" TEXT NOT NULL,
  "userId" INTEGER REFERENCES "Users"("id") ON DELETE CASCADE,
  "teamId" INTEGER REFERENCES "Teams"("id") ON DELETE CASCADE,
  "parentId" INTEGER REFERENCES "Chats"("id") ON DELETE CASCADE,
  "isThreadStarter" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS "Files" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER REFERENCES "Users"("id") ON DELETE CASCADE,
  "filename" VARCHAR(255) NOT NULL,
  "originalName" VARCHAR(255) NOT NULL,
  "mimeType" VARCHAR(100) NOT NULL,
  "size" INTEGER NOT NULL,
  "path" VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS "OAuthProfiles" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER REFERENCES "Users"("id") ON DELETE CASCADE,
  "provider" oauth_provider NOT NULL,
  "providerId" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  UNIQUE ("provider", "providerId")
);

CREATE TABLE IF NOT EXISTS "Sessions" (
  "id" VARCHAR(255) PRIMARY KEY,
  "userId" INTEGER REFERENCES "Users"("id") ON DELETE CASCADE,
  "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);

-- 初期管理者ユーザーの作成（パスワード: admin123）
INSERT INTO "Users" ("userId", "firstName", "lastName", "email", "phone", "prefecture", "city", "address", "password", "role", "createdAt", "updatedAt")
VALUES ('admin', 'Admin', 'User', 'admin@example.com', '000-0000-0000', 'Tokyo', 'Shibuya', 'Address 1', '$2b$10$rw5WpXxHtJ5Wz1i5z5Zt8O5X5Z5Y5W5Z5Y5Z5W5Z5Y5Z5W5Z5Y', 'admin', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- インデックス作成
CREATE INDEX IF NOT EXISTS "idx_posts_userId" ON "Posts"("userId");
CREATE INDEX IF NOT EXISTS "idx_posts_teamId" ON "Posts"("teamId");
CREATE INDEX IF NOT EXISTS "idx_notifications_userId" ON "Notifications"("userId");
CREATE INDEX IF NOT EXISTS "idx_chats_userId" ON "Chats"("userId");
CREATE INDEX IF NOT EXISTS "idx_chats_teamId" ON "Chats"("teamId");
CREATE INDEX IF NOT EXISTS "idx_chats_parentId" ON "Chats"("parentId");
CREATE INDEX IF NOT EXISTS "idx_files_userId" ON "Files"("userId");
CREATE INDEX IF NOT EXISTS "idx_oauth_userId" ON "OAuthProfiles"("userId");
CREATE INDEX IF NOT EXISTS "idx_sessions_userId" ON "Sessions"("userId");
CREATE INDEX IF NOT EXISTS "idx_sessions_expiresAt" ON "Sessions"("expiresAt");

-- その他のテーブル定義...
