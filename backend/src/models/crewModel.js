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
        key: 'id'  // Always reference 'id' as it's the primary key
      }
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    role: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(100),
      allowNull: true
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