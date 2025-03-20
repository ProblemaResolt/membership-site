import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Session } from 'express-session';

export interface AuthUser {
  id: number;
  userId: string;
  role?: string;
}

export type AuthRequest = Request & {
  user: AuthUser;
  session: Session & {
    token?: string;
  };
};

// 戻り値の型をより柔軟に対応
export type AuthHandler = (
  req: AuthRequest,
  res: Response,
  next?: NextFunction
) => Promise<any>;

export type AuthMiddleware = RequestHandler;

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
