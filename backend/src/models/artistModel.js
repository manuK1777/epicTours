import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const Artist = sequelize.define('Artist', {
  id: {
    type: DataTypes.INTEGER(8).UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER(8).UNSIGNED,
    allowNull: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  contact: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  webPage: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  file: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
},
{
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});

export default Artist;