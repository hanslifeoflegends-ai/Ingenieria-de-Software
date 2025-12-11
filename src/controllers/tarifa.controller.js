// tarifa.controller.js
import Tarifa from "../models/tarifa.model.js";  // Asegúrate de que el modelo esté bien importado

export const registrarTarifa = async (req, res) => {
    try {
        const { tipoCarga, precioBase, precioPorKm, kmRecorridos } = req.body;

        console.log("Recibido en el backend:", req.body);

        if (!tipoCarga || !precioBase || !precioPorKm || !kmRecorridos) {
            return res.status(400).json({ mensaje: "Todos los campos son obligatorios." });
        }

        // Crear la nueva tarifa
        const tarifa = await Tarifa.create({
            tipoCarga,
            precioBase,
            precioPorKm,
            kmRecorridos,  // Asegúrate de incluir este campo
        });

        console.log("Tarifa registrada correctamente:", tarifa);

        return res.status(201).json({
            mensaje: "Tarifa registrada correctamente.",
            tarifa,
        });
    } catch (error) {
        console.error("❌ Error al registrar tarifa:", error);
        return res.status(500).json({ mensaje: "Error al registrar la tarifa." });
    }
};

