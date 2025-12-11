import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Conductor = sequelize.define("Conductor", {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },

  rut: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  telefono: {
    type: DataTypes.STRING,
    allowNull: true
  },

  licencia: {
    type: DataTypes.STRING,
    allowNull: false
  },

  estado: {
    type: DataTypes.ENUM("disponible", "ocupado", "descanso"),
    allowNull: false,
    defaultValue: "disponible"
  },

  habilitado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }

}, {
  tableName: "conductores",
  timestamps: true
});

export default Conductor;
