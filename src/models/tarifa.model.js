// tarifa.model.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Tarifa = sequelize.define('Tarifa', {
    tipoCarga: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    precioBase: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    precioPorKm: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    kmRecorridos: {
        type: DataTypes.FLOAT,  // Asegúrate de que sea un número flotante
        allowNull: false,
    },
});

export default Tarifa;
