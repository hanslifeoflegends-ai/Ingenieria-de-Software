import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Usuario = sequelize.define("Usuario", {

  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },

  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    },
    // Normaliza automáticamente el correo ANTES de guardar
    set(value) {
      this.setDataValue("correo", value.toLowerCase().trim());
    }
  },

  contraseña: {
    type: DataTypes.STRING,
    allowNull: false
  },

  rol: {
    type: DataTypes.ENUM("admin", "usuario"),
    defaultValue: "usuario"
  },

  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },

  codigoTemporal: {
    type: DataTypes.STRING,
    allowNull: true
  }

}, {
  tableName: "usuarios",   // 🔥 evita problemas con el plural automático
  timestamps: true          // createdAt y updatedAt
});

export default Usuario;
