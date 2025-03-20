import { Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import { Team } from './Team.js';

interface PostAttributes {
  id?: number; // idをオプショナルに変更
  content: string;
  userId: number;
  teamId?: number;
  visibility: 'public' | 'private' | 'team';
  isApproved: boolean;
  moderationScore?: number;
}

interface PostModel extends Model<InferAttributes<PostModel>, InferCreationAttributes<PostModel>>, PostAttributes {}

const Post = sequelize.define<PostModel>('Post', {
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
  visibility: {
    type: DataTypes.ENUM('public', 'private', 'team'),
    defaultValue: 'public'
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  moderationScore: {
    type: DataTypes.FLOAT
  }
});

Post.belongsTo(User);
Post.belongsTo(Team);

export default Post;
