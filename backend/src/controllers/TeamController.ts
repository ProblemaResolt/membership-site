import { Response } from 'express';
import { AuthRequest, AuthHandler } from '../types/auth.js';
import { Team, TeamMember } from '../models/Team.js';
import User from '../models/User.js';

export const createTeam: AuthHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, isPrivate } = req.body;
    const team = await Team.create({
      name,
      description,
      isPrivate,
      createdBy: req.user.id
    } as any); // 型アサーションを使用

    await TeamMember.create({
      teamId: team.get('id'),
      userId: req.user.id,
      role: 'admin'
    } as any);

    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ error: 'Team creation failed' });
  }
};

export const inviteUser: AuthHandler = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const { teamId, userId, role } = req.body;
    
    // 招待権限の確認
    const memberRole = await TeamMember.findOne({
      where: {
        teamId,
        userId: req.user.id,
        role: ['admin', 'manager']
      }
    });

    if (!memberRole) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    await TeamMember.create({
      teamId,
      userId,
      role
    });

    res.json({ message: 'User invited successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Invitation failed' });
  }
};

export const getTeams: AuthHandler = async (req: AuthRequest, res: Response) => {
  try {
    const teams = await Team.findAll({
      include: [{ model: User, attributes: ['id', 'userId', 'firstName', 'lastName'] }]
    });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
};

export const updateTeam: AuthHandler = async (req: AuthRequest, res: Response) => {
  // 実装を追加
};

export const deleteTeam: AuthHandler = async (req: AuthRequest, res: Response) => {
  // 実装を追加
};

export const getTeamMembers: AuthHandler = async (req: AuthRequest, res: Response) => {
  // 実装を追加
};

export const removeMember: AuthHandler = async (req: AuthRequest, res: Response) => {
  // 実装を追加
};

export const updateMemberRole: AuthHandler = async (req: AuthRequest, res: Response) => {
  // 実装を追加
};

export const getTeamDetails: AuthHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findByPk(teamId, {
      include: [
        {
          model: User,
          attributes: ['id', 'userId', 'firstName', 'lastName'],
          through: { attributes: ['role'] }
        }
      ]
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // チームメンバーかどうかチェック
    const isMember = await TeamMember.findOne({
      where: { teamId, userId: req.user.id }
    });

    if (!isMember && team.get('isPrivate')) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team details' });
  }
};
