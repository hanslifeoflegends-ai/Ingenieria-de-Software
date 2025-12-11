import Camion from "../models/camion.model.js";
import Viaje from "../models/viaje.model.js";
import { Op } from "sequelize";

// ==========================================================
// ACTUALIZAR ESTADO DEL CAMIÓN
// ==========================================================
export const actualizarEstadoCamion = async (req, res) => {
  try {
    const { camionId } = req.params;
    const { nuevoEstado } = req.body;

    const ESTADOS_VALIDOS = ["disponible", "ocupado", "mantenimiento"];

    if (!ESTADOS_VALIDOS.includes(nuevoEstado)) {
      return res.status(400).json({
        message: `Estado inválido. Estados permitidos: ${ESTADOS_VALIDOS.join(", ")}`
      });
    }

    // Buscar camión
    const camion = await Camion.findByPk(camionId);
    if (!camion) {
      return res.status(404).json({ message: "Camión no encontrado." });
    }

    // Buscar viaje activo (no finalizado)
    const viajeActivo = await Viaje.findOne({
      where: {
        camionId,
        estado: {
          [Op.in]: ["en_progreso"]   // tu estado actual de viaje
        }
      }
    });

    // ❌ No puede pasar a disponible si tiene viaje activo
    if (nuevoEstado === "disponible" && viajeActivo) {
      return res.status(400).json({
        message: "No se puede marcar como Disponible: el camión tiene un viaje activo."
      });
    }

    // ❌ No puede marcarse como ocupado si NO tiene viaje activo
    if (nuevoEstado === "ocupado" && !viajeActivo) {
      return res.status(400).json({
        message: "Un camión solo puede estar Ocupado cuando tiene un viaje activo."
      });
    }

    // ACTUALIZAR ESTADO
    camion.estado = nuevoEstado;
    camion.fechaCambioEstado = new Date();
    await camion.save();

    return res.json({
      message: "Estado del camión actualizado correctamente.",
      camion,
      tieneViajeActivo: !!viajeActivo
    });

  } catch (error) {
    console.error("Error actualizarEstadoCamion:", error);
    res.status(500).json({ message: "Error al actualizar estado del camión." });
  }
};
