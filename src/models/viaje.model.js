import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Viaje = sequelize.define("Viaje", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  solicitudId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  camionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  conductorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  creadorId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  tipo_carga: {
    type: DataTypes.STRING,
    allowNull: true
  },

  fechaHora: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },

  fechaFin: {
    type: DataTypes.DATE,
    allowNull: true
  },

  ubicacionFinal: {
    type: DataTypes.STRING,
    allowNull: true
  },

  kmRecorridos: {
    type: DataTypes.FLOAT,
    allowNull: true
  },

  // ⭐⭐⭐ CAMPO NECESARIO PARA EL REPORTE DIARIO
  ingreso: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },

  estado: {
    type: DataTypes.ENUM("pendiente", "en_ruta", "finalizado"),
    defaultValue: "pendiente"
  }

}, {
  tableName: "viajes",
  timestamps: true
});

export default Viaje;
