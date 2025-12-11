import Mantenimiento from "../models/mantenimiento.model.js";
import Camion from "../models/camion.model.js";

export const registrarMantenimiento = async (req, res) => {
    try {
        const { camion, fecha, tipo, detalle } = req.body;

        if (!camion || !fecha || !tipo || !detalle) {
            return res.status(400).json({ mensaje: "Faltan datos obligatorios." });
        }

        // Validar que el camión esté en mantenimiento
        const camionDB = await Camion.findByPk(camion);

        if (!camionDB)
            return res.status(404).json({ mensaje: "Camión no encontrado." });

        if (camionDB.estado !== "mantenimiento") {
            return res.status(400).json({ mensaje: "El camión no está en mantenimiento." });
        }

        const nuevo = await Mantenimiento.create({
            camionId: camion,
            fecha,
            tipo,
            detalle
        });

        res.json({
            mensaje: "Mantenimiento registrado correctamente.",
            mantenimiento: nuevo
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ mensaje: "Error al registrar mantenimiento." });
    }
};

export const listarMantenimientos = async (req, res) => {
    try {
        const data = await Mantenimiento.findAll({
            include: { model: Camion }
        });

        const respuesta = data.map(m => ({
            fecha: m.fecha,
            camion: m.Camion?.patente,
            tipo: m.tipo,
            detalle: m.detalle
        }));

        res.json(respuesta);

    } catch (err) {
        console.error(err);
        res.status(500).json({ mensaje: "Error al obtener historial" });
    }
};
