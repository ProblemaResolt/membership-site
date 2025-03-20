import redisClient from '../config/redis.js';
import { v4 as uuidv4 } from 'uuid';

export class SessionService {
  private static readonly PREFIX = 'session:';
  private static readonly EXPIRE_TIME = 24 * 60 * 60; // 24時間

  static async createSession(userId: number, rememberMe: boolean = false) {
    const sessionId = uuidv4();
    const expireTime = rememberMe ? this.EXPIRE_TIME * 30 : this.EXPIRE_TIME;

    await redisClient.setEx(
      `${this.PREFIX}${sessionId}`,
      expireTime,
      JSON.stringify({ userId, createdAt: new Date() })
    );

    return sessionId;
  }

  static async getSession(sessionId: string) {
    const session = await redisClient.get(`${this.PREFIX}${sessionId}`);
    return session ? JSON.parse(session) : null;
  }

  static async deleteSession(sessionId: string) {
    await redisClient.del(`${this.PREFIX}${sessionId}`);
  }
}
