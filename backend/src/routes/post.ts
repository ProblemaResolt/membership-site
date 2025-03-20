import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { createAuthMiddleware } from '../types/auth.js';
import * as PostController from '../controllers/PostController.js';

const router = Router();

const createPostSchema = {
  content: {
    notEmpty: { errorMessage: 'Content is required' }
  },
  visibility: {
    isIn: { options: [['public', 'private', 'team']] }
  },
  teamId: {
    optional: true,
    isNumeric: true
  }
};

router.post('/', 
  checkSchema(createPostSchema),
  createAuthMiddleware(PostController.createPost)
);

router.get('/', createAuthMiddleware(PostController.getPosts));
router.get('/team/:teamId', createAuthMiddleware(PostController.getTeamPosts));
router.get('/user/:userId', createAuthMiddleware(PostController.getUserPosts));

export default router;
