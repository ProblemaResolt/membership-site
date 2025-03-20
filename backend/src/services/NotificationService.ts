import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { EmailService } from './EmailService.js';

type NotificationType = 'team_invite' | 'message' | 'post_mention';

const notificationTypes: Record<NotificationType, string> = {
  team_invite: 'チーム招待',
  message: 'メッセージ',
  post_mention: 'メンション'
};

interface NotificationData {
  userId: number;
  type: NotificationType;
  content: string;
  relatedId?: number;
}

export const createNotification = async (data: NotificationData) => {
  const notification = await Notification.create({
    ...data,
    isRead: false
  } as any); // 型アサーションを使用してidの要件を回避

  const user = await User.findByPk(data.userId);
  if (user?.get('email')) {
    await EmailService.sendEmail({
      to: user.get('email'),
      subject: `新しい${getNotificationTypeName(data.type)}があります`,
      text: data.content
    });
  }

  return notification;
};

const getNotificationTypeName = (type: NotificationType): string => {
  return notificationTypes[type];
};
