import { Request, Response } from 'express';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';
import User from '../models/User.js';
import { SessionService } from '../services/SessionService.js';
import { sendPasswordResetEmail } from '../services/EmailService.js';
import { AuthRequest } from '../types/common.js';

export const register = async (req: Request, res: Response) => {
  try {
    // ユーザーIDの重複チェック
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { userId: req.body.userId },
          { email: req.body.email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        error: existingUser.get('userId') === req.body.userId
          ? 'このユーザーIDは既に使用されています'
          : 'このメールアドレスは既に登録されています'
      });
    }

    const { password, ...userData } = req.body;
    const hashedPassword = await hash(password, 10);
    
    try {
      const user = await User.create({
        ...userData,
        password: hashedPassword,
        isEmailVerified: false,
        role: 'user'
      });

      res.status(201).json({
        success: true,
        message: '登録が完了しました',
        userId: user.get('userId')
      });
    } catch (validationError: any) {
      if (validationError.name === 'SequelizeValidationError') {
        return res.status(400).json({
          error: validationError.errors[0].message
        });
      }
      throw validationError;
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'ユーザー登録に失敗しました' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { userId, password } = req.body;
    
    // メールアドレスかユーザーIDで検索
    const user = await User.findOne({ 
      where: { 
        [Op.or]: [
          { userId: userId },
          { email: userId }
        ]
      } 
    });

    // ユーザーが見つからない場合のエラーメッセージ
    if (!user) {
      console.log('User not found:', userId);
      return res.status(401).json({ error: 'ユーザーIDまたはパスワードが正しくありません' });
    }

    // パスワードの検証
    const isValidPassword = await compare(password, user.get('password'));
    if (!isValidPassword) {
      console.log('Invalid password for user:', userId);
      return res.status(401).json({ error: 'ユーザーIDまたはパスワードが正しくありません' });
    }

    // ユーザー情報をトークンに含める
    const tokenUser = {
      id: user.get('id'),
      userId: user.get('userId'),
      email: user.get('email'),
      role: user.get('role')
    };

    const token = jwt.sign(
      tokenUser,
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // セッションにトークンを保存
    req.session.token = token;
    await new Promise<void>((resolve, reject) => {
      req.session.save((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // トークンをレスポンスヘッダーに設定
    res.header('Authorization', `Bearer ${token}`);
    
    res.json({ 
      token,
      user: {
        ...tokenUser,
        firstName: user.get('firstName'),
        lastName: user.get('lastName')
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'ログインに失敗しました' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const sessionId = req.cookies.sessionId;
    if (sessionId) {
      await SessionService.deleteSession(sessionId);
      res.clearCookie('sessionId');
    }
    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
};

export const checkUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const exists = await User.findOne({ where: { userId } });
    res.json({ available: !exists });
  } catch (error) {
    res.status(500).json({ error: 'Check failed' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const resetToken = jwt.sign(
      { userId: user.get('userId') },
      process.env.JWT_SECRET || 'reset-secret',
      { expiresIn: '1h' }
    );

    await user.update({
      resetToken,
      resetTokenExpires: new Date(Date.now() + 3600000)
    });

    await sendPasswordResetEmail(email, resetToken);
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ error: 'Password reset failed' });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'verification-secret') as { userId: string };
    
    const user = await User.findOne({ where: { userId: decoded.userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({ isEmailVerified: true });
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid verification token' });
  }
};

export const socialLogin = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication failed' });
  }

  const token = jwt.sign(
    req.user,
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );

  await SessionService.createSession(req.user.id);
  res.json({ token, user: req.user });
};
