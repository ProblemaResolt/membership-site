import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { createAuthMiddleware } from '../types/auth.js';
import * as TeamController from '../controllers/TeamController.js';

const router = Router();

const teamSchema = {
  name: {
    notEmpty: { errorMessage: 'Team name is required' }
  }
};

const inviteSchema = {
  teamId: {
    isNumeric: true
  },
  userId: {
    notEmpty: true
  },
  role: {
    isIn: {
      options: [['admin', 'manager', 'user']],
      errorMessage: 'Invalid role'
    }
  }
};

router.post('/', checkSchema(teamSchema), createAuthMiddleware(TeamController.createTeam));
router.post('/invite', checkSchema(inviteSchema), createAuthMiddleware(TeamController.inviteUser));
router.get('/', createAuthMiddleware(TeamController.getTeams));
router.get('/:teamId', createAuthMiddleware(TeamController.getTeamDetails));
router.put('/:teamId', createAuthMiddleware(TeamController.updateTeam));
router.delete('/:teamId', createAuthMiddleware(TeamController.deleteTeam));

// メンバー管理
router.get('/:teamId/members', createAuthMiddleware(TeamController.getTeamMembers));
router.delete('/:teamId/members/:userId', createAuthMiddleware(TeamController.removeMember));
router.put('/:teamId/members/:userId/role', createAuthMiddleware(TeamController.updateMemberRole));

export default router;
