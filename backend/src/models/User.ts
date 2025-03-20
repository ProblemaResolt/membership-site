import { Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import sequelize from '../config/database.js';

interface UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  prefecture: string;
  city: string;
  address: string;
  password: string;
  isEmailVerified: boolean;
  role: 'admin' | 'manager' | 'user';
  resetToken?: string;
  resetTokenExpires?: Date;
  lastLoginAt?: Date;
}

const User = sequelize.define<UserModel>('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.STRING(16),
    allowNull: false,
    unique: true,
    validate: {
      is: {
        args: /^[a-zA-Z0-9_-]{8,16}$/,
        msg: 'ユーザーIDは8-16文字の英数字とハイフン、アンダースコアのみ使用可能です'
      }
    }
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: {
        args: /^[0-9-]{10,13}$/,
        msg: '電話番号の形式が正しくありません'
      }
    }
  },
  prefecture: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'manager', 'user'),
    defaultValue: 'user'
  }
});

export default User;
