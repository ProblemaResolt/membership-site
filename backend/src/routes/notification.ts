import { Router } from 'express';
import { withAuth } from '../middleware/auth.js';
import { getNotifications, markAsRead } from '../controllers/NotificationController';

const router = Router();

router.get('/', withAuth(getNotifications));
router.put('/:id/read', withAuth(markAsRead));

export default router;
