import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Profile as GoogleProfile } from 'passport-google-oauth20';
import { Profile as GitHubProfile } from 'passport-github2';
import User from '../models/User.js';
import { Op } from 'sequelize';
import crypto from 'crypto';

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Google認証を条件付きで設定
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  }, async (
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: (error: any, user?: any) => void
  ) => {
    try {
      const [user] = await User.findOrCreate({
        where: { email: profile.emails?.[0].value },
        defaults: {
          userId: `google_${profile.id}`,
          firstName: profile.name?.givenName || '',
          lastName: profile.name?.familyName || '',
          email: profile.emails?.[0].value || '',
          password: crypto.randomBytes(32).toString('hex'),
          phone: '未設定',
          prefecture: '未設定',
          city: '未設定',
          address: '未設定',
          isEmailVerified: true,
          role: 'user'
        } as any // idは自動生成されるため、型アサーションを使用
      });
      done(null, user);
    } catch (error) {
      done(error);
    }
  }));
}

// GitHub認証を条件付きで設定
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/api/auth/github/callback'
  }, async (
    accessToken: string,
    refreshToken: string,
    profile: GitHubProfile,
    done: (error: any, user?: any) => void
  ) => {
    // ...existing code...
  }));
}
