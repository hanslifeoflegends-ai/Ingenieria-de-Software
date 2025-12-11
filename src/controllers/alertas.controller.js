import Camion from "../models/camion.model.js";
import Conductor from "../models/conductor.model.js";
import Solicitud from "../models/solicitud.model.js";
import { Op } from "sequelize";

export const obtenerAlertas = async (req, res) => {
  try {
    // ================================
    // 1) ALERTA: SIN CAMIONES DISPONIBLES
    // ================================
    const camionesDisponibles = await Camion.count({
      where: { estado: "disponible" }
    });

    const alertaCamiones = camionesDisponibles === 0;

    // ================================
    // 2) ALERTA: SIN CONDUCTORES DISPONIBLES
    // ================================
    const conductoresDisponibles = await Conductor.count({
      where: { estado: "disponible" }
    });

    const alertaConductores = conductoresDisponibles === 0;

    // ================================
    // 3) SOLICITUDES SIN ASIGNACIÓN > 24h
    // ================================
    const hace24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const solicitudesAtrasadas = await Solicitud.findAll({
      where: {
        estado: "Pendiente",
        createdAt: { [Op.lt]: hace24h }
      }
    });

    const hayAtrasadas = solicitudesAtrasadas.length > 0;

    // ================================
    // ARMAR RESPUESTA
    // ================================
    return res.json({
      alertaCamiones,
      alertaConductores,
      solicitudesAtrasadas,
      hayAtrasadas,
      detalles: {
        totalCamionesDisponibles: camionesDisponibles,
        totalConductoresDisponibles: conductoresDisponibles
      },
      timestamp: new Date()
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener alertas del sistema" });
  }
};
