import { Response } from 'express';
import { Op, WhereOptions } from 'sequelize';
import { AuthRequest, AuthHandler } from '../types/auth.js';
import Chat from '../models/Chat.js';
import { TeamMember } from '../models/Team.js';
import { moderateContent } from '../services/AIModeration.js';

export const createMessage: AuthHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { content, teamId, parentId } = req.body;

    // チームメッセージの権限チェック
    if (teamId) {
      const membership = await TeamMember.findOne({
        where: { teamId, userId: req.user.id }
      });
      if (!membership) {
        return res.status(403).json({ error: 'Team membership required' });
      }
    }

    const message = await Chat.create({
      content,
      userId: req.user.id,
      teamId: teamId || null,
      parentId: parentId || null,
      isThreadStarter: !parentId
    } as any); // 型アサーションを使用して自動インクリメントIDを処理

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Message creation failed' });
  }
};

export const getTeamMessages: AuthHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { teamId } = req.params;
    
    const where: WhereOptions<any> = {
      teamId,
      parentId: null
    };

    const messages = await Chat.findAll({
      where,
      include: [
        { 
          model: Chat,
          as: 'replies',
          limit: 3,
          order: [['createdAt', 'DESC']]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

export const createReply: AuthHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { messageId } = req.params;
    const { content, teamId } = req.body;
    
    const message = await Chat.create({
      content,
      userId: req.user.id,
      teamId: teamId || null,
      parentId: messageId,
      isThreadStarter: false
    } as any);

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Reply creation failed' });
  }
};

export const deleteMessage: AuthHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { messageId } = req.params;
    const message = await Chat.findByPk(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.get('userId') !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await message.destroy();
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Message deletion failed' });
  }
};
