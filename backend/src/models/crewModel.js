import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const Crew = sequelize.define('Crew', {
    id: {
      type: DataTypes.INTEGER(8).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    artist_id: {
      type: DataTypes.INTEGER(8).UNSIGNED,
      allowNull: true,
      references: {
        model: 'Artists',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    role: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    file: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  },
  {
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  });

export default Crew;