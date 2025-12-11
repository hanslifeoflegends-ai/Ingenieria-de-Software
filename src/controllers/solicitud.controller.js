import Solicitud from "../models/solicitud.model.js";
import Camion from "../models/camion.model.js";
import Usuario from "../models/usuario.model.js";
import Cliente from "../models/cliente.model.js";

/* ================================================================
   RF-2 — CREAR SOLICITUD
================================================================ */
export const crearSolicitud = async (req, res) => {
  try {
    const { origen, destino, fecha, tipo_servicio } = req.body;

    if (!origen || !destino || !fecha || !tipo_servicio) {
      return res.status(400).json({ mensaje: "Faltan campos obligatorios." });
    }

    const usuario = await Usuario.findByPk(req.user.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    // Buscar o crear cliente vinculado al usuario
    let cliente = await Cliente.findOne({
      where: { correo: usuario.correo }
    });

    if (!cliente) {
      cliente = await Cliente.create({
        nombre: usuario.nombre,
        correo: usuario.correo,
        telefono: usuario.telefono || "No informado",
        direccion: usuario.direccion || "No informado"
      });
    }

    // Crear solicitud
    const solicitud = await Solicitud.create({
      origen,
      destino,
      fecha,
      tipo_servicio,
      usuarioId: usuario.id,
      clienteId: cliente.id,
      estado: "pendiente"
    });

    return res.json({
      mensaje: "Solicitud creada correctamente.",
      solicitud,
      cliente
    });

  } catch (error) {
    console.error("ERROR crearSolicitud:", error);
    return res.status(500).json({ mensaje: error.message });
  }
};

/* ================================================================
   RF-3 — LISTAR SOLICITUDES DEL USUARIO
================================================================ */
export const listarSolicitudesUsuario = async (req, res) => {
  try {
    const solicitudes = await Solicitud.findAll({
      where: { usuarioId: req.user.id },
      attributes: ["id", "origen", "destino", "fecha", "estado", "tipo_servicio"],
      include: [
        { model: Cliente, as: "cliente", attributes: ["id", "nombre"] }
      ],
      order: [["createdAt", "DESC"]]
    });

    res.json(solicitudes);

  } catch (error) {
    console.error("ERROR listarSolicitudesUsuario:", error);
    res.status(500).json({ mensaje: error.message });
  }
};

/* ================================================================
   RF-3 — LISTAR TODAS LAS SOLICITUDES (ADMIN)
================================================================ */
export const listarSolicitudesAdmin = async (req, res) => {
  try {
    const solicitudes = await Solicitud.findAll({
      include: [
        { model: Cliente, as: "cliente", attributes: ["id", "nombre"] },
        { model: Usuario, as: "usuario", attributes: ["id", "nombre"] } // alias correcto
      ],
      order: [["createdAt", "DESC"]]
    });

    return res.json(solicitudes);

  } catch (error) {
    console.error("ERROR listarSolicitudesAdmin:", error);
    res.status(500).json({ mensaje: error.message });
  }
};

/* ================================================================
   RF-3B — LISTAR SOLICITUDES PENDIENTES
================================================================ */
export const listarSolicitudesPendientes = async (req, res) => {
  try {
    const solicitudes = await Solicitud.findAll({
      where: { estado: "pendiente" },
      attributes: ["id", "origen", "destino", "fecha", "estado", "tipo_servicio"],
      include: [
        { model: Usuario, as: "usuario", attributes: ["id", "nombre"] },
        { model: Cliente, as: "cliente", attributes: ["id", "nombre"] }
      ],
      order: [["createdAt", "ASC"]]
    });

    res.json(solicitudes);

  } catch (error) {
    console.error("ERROR listarSolicitudesPendientes:", error);
    res.status(500).json({ mensaje: error.message });
  }
};

/* ================================================================
   OBTENER SOLICITUD POR ID
================================================================ */
export const listarSolicitudPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const solicitud = await Solicitud.findOne({
      where: { id },
      attributes: ["id", "origen", "destino", "fecha", "estado", "tipo_servicio"],
      include: [
        { model: Cliente, as: "cliente", attributes: ["id", "nombre"] },
        { model: Usuario, as: "usuario", attributes: ["id", "nombre"] }
      ]
    });

    if (!solicitud) {
      return res.status(404).json({ mensaje: "Solicitud no encontrada." });
    }

    res.json(solicitud);

  } catch (error) {
    console.error("ERROR listarSolicitudPorId:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};

/* ================================================================
   RF-6 — ACTUALIZAR ESTADO DE SOLICITUD
================================================================ */
export const actualizarEstadoSolicitud = async (req, res) => {
  try {
    const { solicitudId, nuevoEstado } = req.body;

    if (!solicitudId || !nuevoEstado) {
      return res.status(400).json({ mensaje: "Debe enviar solicitudId y nuevoEstado." });
    }

    const solicitud = await Solicitud.findByPk(solicitudId);

    if (!solicitud)
      return res.status(404).json({ mensaje: "Solicitud no encontrada." });

    const camion = solicitud.camionId
      ? await Camion.findByPk(solicitud.camionId)
      : null;

    // Si la solicitud termina:
    if (["completada", "cancelada"].includes(nuevoEstado)) {
      solicitud.estado = nuevoEstado;
      await solicitud.save();

      if (camion) {
        camion.estado = "disponible";
        await camion.save();
      }

      return res.json({
        mensaje: `Solicitud ${nuevoEstado}. Camión liberado.`,
        solicitud,
        camion
      });
    }

    // Cambio normal de estado
    solicitud.estado = nuevoEstado;
    await solicitud.save();

    res.json({
      mensaje: "Estado actualizado correctamente",
      solicitud
    });

  } catch (error) {
    console.error("ERROR actualizarEstadoSolicitud:", error);
    res.status(500).json({ mensaje: error.message });
  }
};

