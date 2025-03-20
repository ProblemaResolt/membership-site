import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface Notification {
  id: number;
  type: 'team_invite' | 'message' | 'post_mention';
  content: string;
  isRead: boolean;
  createdAt: string;
}

export const NotificationList = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
        credentials: 'include'
      });
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  return (
    <div className="notifications-list">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
          onClick={() => !notification.isRead && markAsRead(notification.id)}
        >
          <div className="notification-content">{notification.content}</div>
          <div className="notification-meta">
            <span>{new Date(notification.createdAt).toLocaleString()}</span>
            <span className="notification-type">{notification.type}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
