import { Response } from 'express';
import { Op } from 'sequelize';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { TeamMember } from '../models/Team.js';
import { moderateContent } from '../services/AIModeration.js';
import { AuthRequest, AuthHandler } from '../types/auth.js';

export const createPost: AuthHandler = async (req: AuthRequest, res: Response) => {
  try {
    // ユーザーチェックを追加
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { content, teamId, visibility } = req.body;

    // チーム投稿の権限チェック
    if (teamId) {
      const membership = await TeamMember.findOne({
        where: { teamId, userId: req.user.id }
      });
      if (!membership) {
        return res.status(403).json({ error: 'Team membership required' });
      }
    }

    // AI モデレーション
    const moderation = await moderateContent(content);
    
    const post = await Post.create({
      content,
      userId: req.user.id,
      teamId,
      visibility,
      isApproved: moderation.isAppropriate,
      moderationScore: moderation.score
    });

    res.status(201).json({
      ...post.toJSON(),
      moderationMessage: moderation.reason
    });
  } catch (error) {
    console.error('Post creation error:', error);
    res.status(500).json({ error: 'Post creation failed' });
  }
};

export const getPosts: AuthHandler = async (req: AuthRequest, res: Response) => {
  try {
    const posts = await Post.findAll({
      where: {
        [Op.or]: [
          { visibility: 'public' },
          {
            [Op.and]: [
              { userId: req.user.id },
              { visibility: 'private' }
            ]
          }
        ],
        isApproved: true
      },
      include: [
        {
          model: User,
          attributes: ['userId', 'firstName', 'lastName']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

export const getTeamPosts: AuthHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { teamId } = req.params;
    const membership = await TeamMember.findOne({
      where: { teamId, userId: req.user.id }
    });

    if (!membership) {
      return res.status(403).json({ error: 'Team access denied' });
    }

    const posts = await Post.findAll({
      where: {
        teamId,
        isApproved: true
      },
      include: [
        {
          model: User,
          attributes: ['userId', 'firstName', 'lastName']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team posts' });
  }
};

export const getUserPosts: AuthHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const posts = await Post.findAll({
      where: {
        userId,
        [Op.or]: [
          { visibility: 'public' },
          { userId: req.user.id }
        ]
      },
      include: [
        {
          model: User,
          attributes: ['userId', 'firstName', 'lastName']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
};
