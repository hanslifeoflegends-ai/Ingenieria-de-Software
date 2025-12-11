import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Camion = sequelize.define("Camion", {

  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  patente: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  capacidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  marca: {
    type: DataTypes.STRING
  },

  modelo: {
    type: DataTypes.STRING
  },

  anio: {
    type: DataTypes.INTEGER
  },

  estado: {
    type: DataTypes.ENUM("disponible", "ocupado", "mantenimiento"),
    allowNull: false,
    defaultValue: "disponible"
  },

  habilitado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },

  fechaCambioEstado: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },

  /**  NUEVOS CAMPOS NECESARIOS  **/
  kmTotales: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },

  kmUltimaMantencion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },

  limiteMantencion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10000
  }

}, {
  tableName: "camiones",
  timestamps: true
});

export default Camion;
