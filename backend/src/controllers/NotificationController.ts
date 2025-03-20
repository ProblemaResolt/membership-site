import { Response } from 'express';
import { AuthRequest } from '../types/auth.js';
import Notification from '../models/Notification.js';

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 20
    });
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await Notification.update(
      { isRead: true },
      { 
        where: { 
          id,
          userId: req.user.id 
        } 
      }
    );

    if (result[0] === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
};
