import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Solicitud = sequelize.define("Solicitud", {
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },

  origen: {
    type: DataTypes.STRING,
    allowNull: false
  },

  destino: {
    type: DataTypes.STRING,
    allowNull: false
  },

  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  estado: {
    type: DataTypes.STRING,
    defaultValue: "pendiente"
  },

  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  clienteId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  camionId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  // ⭐⭐⭐ NUEVO: TIPO DE CARGA ASOCIADO A LA SOLICITUD
  tipo_carga: {
    type: DataTypes.STRING,
    allowNull: true
  },

  tipo_servicio: {
    type: DataTypes.STRING,
    allowNull: false
  }

}, {
  tableName: "solicitudes",
  timestamps: true
});

export default Solicitud;
