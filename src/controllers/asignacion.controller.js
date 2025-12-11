import Solicitud from "../models/solicitud.model.js";
import Camion from "../models/camion.model.js";
import Conductor from "../models/conductor.model.js";
import Viaje from "../models/viaje.model.js";


// =====================================================================================
// ASIGNAR CAMIÓN + CONDUCTOR + CREAR VIAJE AUTOMÁTICAMENTE
// =====================================================================================

export const asignarCamion = async (req, res) => {
  try {
    const { solicitudId, camionId, conductorId } = req.body;

    // Validaciones básicas
    if (!solicitudId || !camionId || !conductorId) {
      return res.status(400).json({ mensaje: "Debe enviar solicitudId, camionId y conductorId" });
    }

    // Buscar solicitud
    const solicitud = await Solicitud.findByPk(solicitudId);
    if (!solicitud) {
      return res.status(404).json({ mensaje: "Solicitud no encontrada" });
    }

    if (solicitud.estado !== "pendiente") {
      return res.status(400).json({ mensaje: "La solicitud no está disponible para asignación" });
    }

    // Buscar camión
    const camion = await Camion.findByPk(camionId);
    if (!camion) {
      return res.status(404).json({ mensaje: "Camión no encontrado" });
    }

    // Validar estado de camión
    if (camion.estado === "mantenimiento") {
      return res.status(400).json({ mensaje: "Este camión está en mantenimiento" });
    }
    if (camion.estado !== "disponible") {
      return res.status(400).json({ mensaje: "El camión no está disponible" });
    }

    // Buscar conductor
    const conductor = await Conductor.findByPk(conductorId);
    if (!conductor) {
      return res.status(404).json({ mensaje: "Conductor no encontrado" });
    }

    // Validar estado de conductor
    if (conductor.estado === "descanso") {
      return res.status(400).json({ mensaje: "Este conductor está en descanso" });
    }
    if (conductor.estado !== "disponible") {
      return res.status(400).json({ mensaje: "El conductor no está disponible" });
    }

    // ===============================
    // ASIGNAR LA SOLICITUD
    // ===============================
    solicitud.estado = "asignada";
    solicitud.camionId = camionId;
    solicitud.conductorId = conductorId;
    await solicitud.save();

    // ===============================
    // ACTUALIZAR ESTADOS
    // ===============================
    camion.estado = "ocupado";
    await camion.save();

    conductor.estado = "asignado";
    await conductor.save();

    // ===============================
    // CREAR VIAJE AUTOMÁTICO
    // ===============================
    const viaje = await Viaje.create({
      origen: solicitud.origen,
      destino: solicitud.destino,
      distancia: solicitud.distancia || 0,
      solicitudId: solicitud.id,
      camionId,
      conductorId,
      usuarioId: req.user.id,
      estado: "pendiente"
    });

    return res.json({
      mensaje: "Asignación realizada correctamente",
      solicitud,
      camion,
      conductor,
      viaje
    });

  } catch (error) {
    console.error("Error en asignarCamion:", error);
    return res.status(500).json({ error: error.message });
  }
};
