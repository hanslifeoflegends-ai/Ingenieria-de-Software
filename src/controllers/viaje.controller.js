import Viaje from "../models/viaje.model.js";
import Camion from "../models/camion.model.js";
import Conductor from "../models/conductor.model.js";
import Solicitud from "../models/solicitud.model.js";
import Cliente from "../models/cliente.model.js"; // ⭐ NECESARIO



/* ===========================================================
   REGISTRAR VIAJE
=========================================================== */
export const registrarViaje = async (req, res) => {
  try {
    const { solicitudId, camionId, conductorId, tipo_carga } = req.body;

    // Validación de datos obligatorios
    if (!solicitudId || !camionId || !conductorId || !tipo_carga) {
      return res.status(400).json({ mensaje: "Faltan datos obligatorios." });
    }

    // Validación de existencia de solicitud, camión y conductor
    const solicitud = await Solicitud.findByPk(solicitudId);
    if (!solicitud) return res.status(404).json({ mensaje: "Solicitud no encontrada." });

    const camion = await Camion.findByPk(camionId);
    if (!camion) return res.status(404).json({ mensaje: "Camión no encontrado." });

    const conductor = await Conductor.findByPk(conductorId);
    if (!conductor) return res.status(404).json({ mensaje: "Conductor no encontrado." });

    // Crear el viaje
    const viaje = await Viaje.create({
      solicitudId,
      camionId,
      conductorId,
      tipo_carga,
      estado: "pendiente"
    });

    // Actualizar estados de solicitud, camión y conductor
    solicitud.estado = "asignada";
    await solicitud.save();

    camion.estado = "ocupado";
    await camion.save();

    conductor.estado = "ocupado";
    await conductor.save();

    return res.status(201).json({
      mensaje: "Viaje asignado correctamente",
      viaje
    });

  } catch (error) {
    console.error("❌ Error registrarViaje:", error);
    return res.status(500).json({ mensaje: "Error en servidor", error });
  }
};



/* ===========================================================
   INICIAR VIAJE
=========================================================== */
export const iniciarViaje = async (req, res) => {
  try {
    const { viajeId, fechaInicio, ubicacionInicio } = req.body;

    const viaje = await Viaje.findByPk(viajeId);
    if (!viaje) return res.status(404).json({ mensaje: "Viaje no encontrado." });

    if (viaje.estado !== "pendiente") {
      return res.status(400).json({ mensaje: "El viaje no puede iniciar." });
    }

    // Cambiar el estado a "en_ruta"
    viaje.estado = "en_ruta";
    viaje.fechaInicio = fechaInicio;
    viaje.ubicacionInicio = ubicacionInicio;

    await viaje.save();

    return res.json({ mensaje: "Viaje iniciado.", viaje });

  } catch (error) {
    console.error("ERROR iniciarViaje:", error);
    return res.status(500).json({ mensaje: error.message });
  }
};



/* ===========================================================
   FINALIZAR VIAJE
=========================================================== */
export const finalizarViaje = async (req, res) => {
  try {
    const { viajeId, fechaFin, ubicacionFinal, kmRecorridos, observaciones } = req.body;

    // Buscar viaje
    const viaje = await Viaje.findByPk(viajeId);
    if (!viaje) {
      return res.status(404).json({ mensaje: "Viaje no encontrado." });
    }

    // Validar estado
    if (viaje.estado !== "en_ruta") {
      return res.status(400).json({ mensaje: "Solo viajes en ruta pueden finalizar." });
    }

    // Buscar camión relacionado
    const camion = await Camion.findByPk(viaje.camionId);

    if (camion) {
      // Sumar kilómetros recorridos al total
      camion.kmTotales += Number(kmRecorridos);

      // Cálculo para determinar si requiere mantención
      const kmDesdeUltimaMantencion =
        camion.kmTotales - camion.kmUltimaMantencion;

      if (kmDesdeUltimaMantencion >= camion.limiteMantencion) {
        // 🚧 CAMIÓN REQUIERE MANTENCIÓN
        camion.estado = "mantenimiento";
        camion.habilitado = false;
      } else {
        // Puede volver a operativo
        camion.estado = "disponible";
        camion.habilitado = true;
      }

      await camion.save();
    }

    // Cambiar estado del conductor a disponible
    const conductor = await Conductor.findByPk(viaje.conductorId);
    if (conductor) {
      conductor.estado = "disponible";
      await conductor.save();
    }

    // Finalizamos el viaje
    viaje.estado = "finalizado";
    viaje.fechaFin = fechaFin || new Date();
    viaje.ubicacionFinal = ubicacionFinal;
    viaje.kmRecorridos = kmRecorridos;
    viaje.observacionesFinal = observaciones || "";

    await viaje.save();

    // Marcar solicitud como completada
    const solicitud = await Solicitud.findByPk(viaje.solicitudId);
    if (solicitud) {
      solicitud.estado = "completada";
      await solicitud.save();
    }

    return res.json({
      mensaje: "Viaje finalizado correctamente.",
      viaje,
      alerta_mantenimiento:
        camion && camion.estado === "mantenimiento"
          ? `⚠ El camión ${camion.patente} requiere mantención.`
          : null
    });

  } catch (error) {
    console.error("ERROR finalizarViaje:", error);
    return res.status(500).json({ mensaje: error.message });
  }
};



/* ===========================================================
   LISTAR VIAJES EN RUTA
=========================================================== */
export const listarViajesEnRuta = async (req, res) => {
  try {
    const viajes = await Viaje.findAll({
      where: { estado: "en_ruta" },
      include: [
        {
          model: Solicitud,
          as: "solicitudViaje",
          include: [{ model: Cliente, as: "cliente", attributes: ["nombre"] }]
        },
        { model: Camion, as: "camion" },
        { model: Conductor, as: "conductor" }
      ]
    });

    return res.json(viajes);

  } catch (error) {
    console.error("ERROR listarViajesEnRuta:", error);
    return res.status(500).json({ mensaje: error.message });
  }
};



/* ===========================================================
   LISTAR VIAJES ASIGNADOS (pendientes)
=========================================================== */
export const listarViajesAsignados = async (req, res) => {
  try {
    const viajes = await Viaje.findAll({
      where: { estado: "pendiente" },
      include: [
        {
          model: Solicitud,
          as: "solicitudViaje",
          attributes: ["id", "origen", "destino", "fecha"],
          include: [{ model: Cliente, as: "cliente", attributes: ["nombre"] }]
        }
      ]
    });

    return res.json(
      viajes.map(v => ({
        id: v.id,
        origen: v.solicitudViaje?.origen,
        destino: v.solicitudViaje?.destino,
        cliente: v.solicitudViaje?.cliente?.nombre,
        solicitudId: v.solicitudViaje?.id
      }))
    );

  } catch (error) {
    console.error("Error listando viajes asignados:", error);
    return res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};


/* ===========================================================
   HISTORIAL POR CAMIÓN
=========================================================== */
export const historialPorCamion = async (req, res) => {
  try {
    const { camionId } = req.params;

    const viajes = await Viaje.findAll({
      where: { camionId, estado: "finalizado" },
      include: [
        {
          model: Solicitud,
          as: "solicitudViaje",
          attributes: ["origen", "destino", "fecha"],
          include: [{ model: Cliente, as: "cliente", attributes: ["nombre"] }]
        },
        { model: Conductor, as: "conductor", attributes: ["nombre"] },
        { model: Camion, as: "camion", attributes: ["patente"] }
      ],
      order: [["fechaFin", "DESC"]]
    });

    return res.json(
      viajes.map(v => ({
        id: v.id,
        fecha: v.fechaFin,
        origen: v.solicitudViaje?.origen,
        destino: v.solicitudViaje?.destino,
        cliente: v.solicitudViaje?.cliente?.nombre,
        conductor: v.conductor?.nombre,
        camion: v.camion?.patente,
        estado: v.estado
      }))
    );

  } catch (error) {
    console.error("ERROR historialPorCamion:", error);
    return res.status(500).json({ mensaje: error.message });
  }
};


/* ===========================================================
   HISTORIAL POR CLIENTE
=========================================================== */
export const historialPorCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;

    const viajes = await Viaje.findAll({
      where: { estado: "finalizado" },
      include: [
        {
          model: Solicitud,
          as: "solicitudViaje",
          where: { clienteId },
          include: [{ model: Cliente, as: "cliente", attributes: ["nombre"] }]
        },
        { model: Camion, as: "camion", attributes: ["patente"] },
        { model: Conductor, as: "conductor", attributes: ["nombre"] }
      ],
      order: [["fechaFin", "DESC"]]
    });

    return res.json(
      viajes.map(v => ({
        id: v.id,
        fecha: v.fechaFin,
        origen: v.solicitudViaje?.origen,
        destino: v.solicitudViaje?.destino,
        camion: v.camion?.patente,
        conductor: v.conductor?.nombre,
        estado: v.estado
      }))
    );

  } catch (error) {
    console.error("ERROR historialPorCliente:", error);
    return res.status(500).json({ mensaje: error.message });
  }
};


/* ===========================================================
   OBTENER VIAJE POR ID
=========================================================== */
export const obtenerViajePorId = async (req, res) => {
  try {
    const { id } = req.params;

    const viaje = await Viaje.findByPk(id, {
      include: [
        {
          model: Solicitud,
          as: "solicitudViaje",
          include: [{ model: Cliente, as: "cliente", attributes: ["nombre"] }]
        },
        { model: Camion, as: "camion" },
        { model: Conductor, as: "conductor" }
      ]
    });

    if (!viaje)
      return res.status(404).json({ mensaje: "Viaje no encontrado." });

    return res.json({
      id: viaje.id,
      origen: viaje.solicitudViaje?.origen,
      destino: viaje.solicitudViaje?.destino,
      cliente: viaje.solicitudViaje?.cliente?.nombre,
      camion: viaje.camion?.patente,
      conductor: viaje.conductor?.nombre,
      fechaAsignacion: viaje.createdAt,
      ubicacionInicio: viaje.ubicacionInicio || ""
    });

  } catch (error) {
    console.error("ERROR obtenerViajePorId:", error);
    return res.status(500).json({ mensaje: error.message });
  }
};


export const guardarMontoViaje = async (req, res) => {
  const { viajeId } = req.params;
  const { ingreso } = req.body;

  // Validar ingreso
  if (isNaN(ingreso) || ingreso < 0) {
    return res.status(400).json({ mensaje: "Ingreso no válido" });
  }

  try {
    const viaje = await Viaje.findByPk(viajeId);
    if (!viaje) {
      return res.status(404).json({ mensaje: "Viaje no encontrado" });
    }

    viaje.ingreso = ingreso;     // ✔ actualizar ingreso
    await viaje.save();          // ✔ guardar en BD

    res.json({
      mensaje: "Ingreso guardado correctamente",
      viaje
    });

  } catch (error) {
    console.error("Error guardando ingreso:", error);
    res.status(500).json({ mensaje: "Error interno" });
  }
};




