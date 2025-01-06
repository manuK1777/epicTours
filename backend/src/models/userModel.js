import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER(8).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: {
      name: 'username_unique',  // Explicitly name the constraint
      msg: 'Username must be unique'
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: {
      name: 'email_unique',  // Explicitly name the constraint
      msg: 'Email must be unique'
    }
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'manager', 'user'),
    allowNull: false,
    defaultValue: 'user'
  }
}, {
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at',
  indexes: [
    {
      unique: true,
      fields: ['username'],
      name: 'username_unique'
    },
    {
      unique: true,
      fields: ['email'],
      name: 'email_unique'
    }
  ]
});

export default User;