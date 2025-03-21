datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id              Int           @id @default(autoincrement())
  userId          String        @unique @db.VarChar(16)
  firstName       String
  lastName        String
  email           String        @unique
  phone           String
  prefecture      String
  city            String
  address         String
  password        String
  isEmailVerified Boolean       @default(false)
  role            Role          @default(user)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  resetToken      String?
  resetTokenExpires DateTime?
  lastLoginAt     DateTime?

  // Relations
  posts           Post[]
  teamMembers     TeamMember[]
  notifications   Notification[]
  chats           Chat[]
  files           File[]
  oauthProfiles   OAuthProfile[]
  sessions        Session[]
  createdTeams    Team[]        @relation("TeamCreator")
}

model Team {
  id          Int          @id @default(autoincrement())
  name        String       @unique
  description String?
  createdBy   Int
  isPrivate   Boolean      @default(false)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  // Relations
  creator     User         @relation("TeamCreator", fields: [createdBy], references: [id])
  members     TeamMember[]
  posts       Post[]
  chats       Chat[]
}

model TeamMember {
  teamId    Int
  userId    Int
  role      Role      @default(user)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  // Relations
  team      Team      @relation(fields: [teamId], references: [id], onDelete: Cascade)
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([teamId, userId])
}

model Post {
  id              Int         @id @default(autoincrement())
  content         String      @db.Text
  userId          Int
  teamId          Int?
  visibility      Visibility  @default(public)
  isApproved      Boolean     @default(false)
  moderationScore Float?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  // Relations
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  team      Team?     @relation(fields: [teamId], references: [id], onDelete: SetNull)
}

model Chat {
  id              Int       @id @default(autoincrement())
  content         String    @db.Text
  userId          Int
  teamId          Int
  parentId        Int?
  isThreadStarter Boolean   @default(false)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relations
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  team      Team      @relation(fields: [teamId], references: [id], onDelete: Cascade)
  parent    Chat?     @relation("ThreadReplies", fields: [parentId], references: [id], onDelete: Cascade)
  replies   Chat[]    @relation("ThreadReplies")
}

model Notification {
  id          Int              @id @default(autoincrement())
  userId      Int
  type        NotificationType
  content     String          @db.Text
  isRead      Boolean         @default(false)
  relatedId   Int?
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  // Relations
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model File {
  id            Int       @id @default(autoincrement())
  userId        Int
  filename      String
  originalName  String
  mimeType      String
  size          Int
  path          String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model OAuthProfile {
  id          Int           @id @default(autoincrement())
  userId      Int
  provider    OAuthProvider
  providerId  String
  email       String?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  // Relations
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerId])
}

model Session {
  id          String    @id
  userId      Int
  expiresAt   DateTime
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @default(now())

  // Relations
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([expiresAt])
}

enum Role {
  admin
  manager
  user
}

enum Visibility {
  public
  private
  team
}

enum NotificationType {
  team_invite
  message
  post_mention
}

enum OAuthProvider {
  google
  github
}
