import { DataTypes } from "sequelize";
import { sequelize } from '../db.js';

const Contact = sequelize.define("Contact", {
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    website: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    socialMedia: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at'
});

export default Contact;
