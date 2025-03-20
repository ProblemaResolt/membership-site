import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

interface NotificationAttributes {
  id: number;
  userId: number;
  type: 'team_invite' | 'message' | 'post_mention';
  content: string;
  isRead: boolean;
  relatedId?: number;
}

const Notification = sequelize.define<Model<NotificationAttributes>>('Notification', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('team_invite', 'message', 'post_mention'),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  relatedId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
});

Notification.belongsTo(User);

export default Notification;
