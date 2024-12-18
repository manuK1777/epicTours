import { DataTypes } from "sequelize";
import { sequelize } from '../db.js';
import Contact from './contactModel.js';

const Location = sequelize.define("Location", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
    },
    category: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    contact_id: { 
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Contact,
            key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
    },
},
{
     timestamps: true, 
     updatedAt: 'updated_at',
     createdAt: 'created_at'
   });

Location.belongsTo(Contact, { foreignKey: "contact_id", as: "contact" });

export default Location;
