import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Cliente = sequelize.define("Cliente", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },

  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  telefono: {
    type: DataTypes.STRING,
    allowNull: false
  },

  direccion: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: "clientes",
  timestamps: true
});

export default Cliente;
