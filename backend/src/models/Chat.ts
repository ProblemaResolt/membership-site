import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import { Team } from './Team.js';

interface ChatAttributes {
  id: number;
  content: string;
  userId: number;
  teamId?: number;
  parentId?: number;
  isThreadStarter: boolean;
}

const Chat = sequelize.define<Model<ChatAttributes>>('Chat', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  teamId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Team,
      key: 'id'
    }
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Chats',
      key: 'id'
    }
  },
  isThreadStarter: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

Chat.belongsTo(User);
Chat.belongsTo(Team);
Chat.belongsTo(Chat, { as: 'parent', foreignKey: 'parentId' });
Chat.hasMany(Chat, { as: 'replies', foreignKey: 'parentId' });

export default Chat;
