import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const Crew = sequelize.define('Crew', {
    id: {
      type: DataTypes.INTEGER(8).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
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
      allowNull: true,
    },
  },
  {
   // indexes: [{ unique: true, fields: ['title'] }],
    timestamps: true, // Activa la creación automática de createdAt y updatedAt
    updatedAt: 'updated_at',
    createdAt: 'created_at'
  });

  export default Crew;