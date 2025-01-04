import { DataTypes } from "sequelize";
import { sequelize } from '../db.js';

const VenueBooker = sequelize.define("VenueBooker", {
    id: {
        type: DataTypes.INTEGER(8).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    venue_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Locations',
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // Optional Fields
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at'
});

export default VenueBooker;
