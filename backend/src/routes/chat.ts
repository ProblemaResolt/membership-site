import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { withAuth } from '../middleware/auth.js';
import * as ChatController from '../controllers/ChatController.js';
import type { Request, Response } from 'express';

const router = Router();

const messageSchema = {
  content: {
    notEmpty: { errorMessage: 'Content is required' }
  },
  teamId: {
    optional: true,
    isNumeric: true
  }
};

router.post('/', 
  checkSchema(messageSchema),
  withAuth(ChatController.createMessage)
);

router.get('/team/:teamId', 
  withAuth(ChatController.getTeamMessages)
);

router.post('/:messageId/reply',
  checkSchema({
    content: { notEmpty: true },
    teamId: { optional: true, isNumeric: true }
  }),
  withAuth(ChatController.createReply)
);

router.delete('/:messageId', 
  withAuth(ChatController.deleteMessage)
);

export default router;
