import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AuthRequest, AuthHandler, AuthUser } from '../types/auth.js';
import jwt from 'jsonwebtoken';
import { SessionService } from '../services/SessionService.js';
import redisClient from '../config/redis.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const createAuthMiddleware = (handler: AuthHandler): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      await handler(req as AuthRequest, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export const withAuth = (handler: AuthHandler): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      await handler(req as AuthRequest, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1] || req.session?.token;

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as AuthUser;
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Authentication failed' });
  }
};

export const rememberMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.body.rememberMe && req.session?.cookie) {
    req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
  }
  next();
};

export const authenticateSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sessionId = req.cookies?.sessionId;

  if (!sessionId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const session = await SessionService.getSession(sessionId);
    if (!session) {
      res.clearCookie('sessionId');
      return res.status(401).json({ error: 'Session expired' });
    }

    req.user = { id: session.userId } as AuthUser;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
};

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    next();
  } catch (error) {
    next(error);
  }
};
