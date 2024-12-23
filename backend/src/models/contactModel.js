import { DataTypes } from "sequelize";
import { sequelize } from '../db.js';

const Contact = sequelize.define("Contact", {
    id: {
        type: DataTypes.INTEGER(8).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at'
});

export default Contact;
