import { Router, Request, Response } from 'express';
import { checkSchema } from 'express-validator';
import passport from 'passport';
import * as AuthController from '../controllers/AuthController.js';
import { AuthRequest, createAuthMiddleware } from '../types/auth.js';

const router = Router();

const registerSchema = {
  userId: {
    matches: {
      options: /^[a-zA-Z0-9_-]{8,16}$/,
      errorMessage: 'ユーザーIDは8-16文字の英数字とハイフン、アンダースコアのみ使用可能です'
    }
  },
  firstName: {
    notEmpty: {
      errorMessage: '姓は必須です'
    }
  },
  lastName: {
    notEmpty: {
      errorMessage: '名は必須です'
    }
  },
  email: {
    isEmail: {
      errorMessage: '有効なメールアドレスを入力してください'
    }
  },
  phone: {
    matches: {
      options: /^[0-9-]{10,13}$/,
      errorMessage: '有効な電話番号を入力してください'
    }
  },
  prefecture: {
    notEmpty: {
      errorMessage: '都道府県は必須です'
    }
  },
  city: {
    notEmpty: {
      errorMessage: '市区町村は必須です'
    }
  },
  address: {
    notEmpty: {
      errorMessage: '住所は必須です'
    }
  },
  password: {
    isLength: {
      options: { min: 8 },
      errorMessage: 'パスワードは8文字以上必要です'
    }
  }
};

router.post('/register', 
  checkSchema(registerSchema),
  (req: Request, res: Response) => AuthController.register(req, res)
);

router.post('/login', (req: Request, res: Response) => 
  AuthController.login(req as AuthRequest, res)
);

router.post('/logout', createAuthMiddleware(AuthController.logout));
router.get('/check-user-id/:userId', createAuthMiddleware(AuthController.checkUserId));
router.post('/reset-password', createAuthMiddleware(AuthController.resetPassword));
router.post('/verify-email', createAuthMiddleware(AuthController.verifyEmail));

// OAuth routes
if (process.env.GOOGLE_CLIENT_ID) {
  router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));

  router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req: Request, res: Response) => AuthController.socialLogin(req as AuthRequest, res)
  );
}

if (process.env.GITHUB_CLIENT_ID) {
  router.get('/github', passport.authenticate('github', {
    scope: ['user:email']
  }));

  router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    createAuthMiddleware(AuthController.socialLogin)
  );
}

export default router;
