import { Request, Response, NextFunction } from 'express';

export type AuthRequest = Request & {
  user: Express.User;
};

export type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any> | any;

export type AuthenticatedHandler = (
  req: Request & { user: Express.User },
  res: Response,
  next: NextFunction
) => Promise<any> | any;

// 削除推奨: auth.tsに統合
