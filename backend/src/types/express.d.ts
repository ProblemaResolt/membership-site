import { AuthUser } from './auth.js';
import { Session } from 'express-session';

declare module 'express-session' {
  interface SessionData {
    token?: string;
  }
}

declare global {
  namespace Express {
    interface User extends AuthUser {}
    
    interface Request {
      user?: User;
      session: Session & {
        token?: string;
      };
    }
  }
}

export {};
