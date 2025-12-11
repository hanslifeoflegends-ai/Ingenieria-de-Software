import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Camion from "./camion.model.js";

const Mantenimiento = sequelize.define("Mantenimiento", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    tipo: {
        type: DataTypes.STRING,
        allowNull: false
    },

    detalle: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    camionId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

}, { tableName: "mantenimientos" });

Mantenimiento.belongsTo(Camion, { foreignKey: "camionId" });

export default Mantenimiento;
