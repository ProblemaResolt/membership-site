import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

interface TeamAttributes {
  id: number;
  name: string;
  description: string;
  createdBy: number;
  isPrivate: boolean;
}

const Team = sequelize.define<Model<TeamAttributes>>('Team', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  isPrivate: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

// チームメンバーシップの関連付け
const TeamMember = sequelize.define('TeamMember', {
  role: {
    type: DataTypes.ENUM('admin', 'manager', 'user'),
    defaultValue: 'user'
  }
});

Team.belongsToMany(User, { through: TeamMember });
User.belongsToMany(Team, { through: TeamMember });

export { Team, TeamMember };
