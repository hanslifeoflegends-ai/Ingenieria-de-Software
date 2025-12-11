import Camion from "../models/camion.model.js";
import Viaje from "../models/viaje.model.js";

/* ===========================================================
   REGISTRAR CAMIÓN
=========================================================== */
export const registrarCamion = async (req, res) => {
  try {
    let { patente, capacidad, marca, modelo, anio } = req.body;

    patente = patente?.trim().toUpperCase();
    marca = marca?.trim();
    modelo = modelo?.trim();

    if (!patente || !capacidad) {
      return res.status(400).json({ mensaje: "Patente y capacidad son obligatorias." });
    }

    const existe = await Camion.findOne({ where: { patente } });
    if (existe) {
      return res.status(400).json({ mensaje: "La patente ya está registrada." });
    }

    const camion = await Camion.create({
      patente,
      capacidad,
      marca,
      modelo,
      anio,
      estado: "disponible",
      fechaCambioEstado: new Date(),
      kmTotales: 0,
      kmUltimaMantencion: 0,
      limiteMantencion: 10000 // Se puede cambiar si quieres
    });

    res.json({ mensaje: "Camión registrado correctamente.", camion });

  } catch (error) {
    console.error("Error registrando camión:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ===========================================================
   LISTAR TODOS LOS CAMIONES
=========================================================== */
export const listarCamiones = async (req, res) => {
  try {
    const camiones = await Camion.findAll();
    const respuesta = [];

    for (const cam of camiones) {
      const viajeActivo = await Viaje.findOne({
        where: { camionId: cam.id, estado: "en_ruta" }
      });

      respuesta.push({
        ...cam.toJSON(),
        tieneViajeActivo: Boolean(viajeActivo)
      });
    }

    res.json(respuesta);

  } catch (error) {
    console.error("Error listando camiones:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ===========================================================
   LISTAR CAMIONES DISPONIBLES
=========================================================== */
export const listarCamionesDisponibles = async (req, res) => {
  try {
    const camiones = await Camion.findAll({ where: { estado: "disponible" } });
    res.json(camiones);

  } catch (error) {
    console.error("Error listando disponibles:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ===========================================================
   LISTAR CAMIONES EN MANTENCIÓN
=========================================================== */
export const listarCamionesEnMantenimiento = async (req, res) => {
  try {
    const camiones = await Camion.findAll({ where: { estado: "mantenimiento" } });
    res.json(camiones);

  } catch (error) {
    console.error("Error listando en mantención:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ===========================================================
   OBTENER CAMIÓN POR ID
=========================================================== */
export const obtenerCamionPorId = async (req, res) => {
  try {
    const camion = await Camion.findByPk(req.params.id);

    if (!camion) return res.status(404).json({ mensaje: "Camión no encontrado." });

    res.json(camion);

  } catch (error) {
    console.error("Error obteniendo camión:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ===========================================================
   ACTUALIZAR ESTADO DEL CAMIÓN
=========================================================== */
export const actualizarCamion = async (req, res) => {
  try {
    const { id } = req.params;
    const { nuevoEstado } = req.body;

    const VALIDOS = ["disponible", "ocupado", "mantenimiento"];

    if (!VALIDOS.includes(nuevoEstado)) {
      return res.status(400).json({ mensaje: "Estado inválido." });
    }

    const camion = await Camion.findByPk(id);
    if (!camion) return res.status(404).json({ mensaje: "Camión no encontrado." });

    const viajeActivo = await Viaje.findOne({
      where: { camionId: id, estado: "en_ruta" }
    });

    if (viajeActivo && nuevoEstado !== "ocupado") {
      return res.status(400).json({
        mensaje: "No se puede cambiar estado: el camión tiene un viaje activo."
      });
    }

    camion.estado = nuevoEstado;
    camion.fechaCambioEstado = new Date();
    camion.habilitado = nuevoEstado !== "mantenimiento";

    await camion.save();

    res.json({ mensaje: "Estado actualizado correctamente.", camion });

  } catch (error) {
    console.error("Error actualizando estado:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ===========================================================
   ELIMINAR CAMIÓN
=========================================================== */
export const eliminarCamion = async (req, res) => {
  try {
    const camion = await Camion.findByPk(req.params.id);

    if (!camion) return res.status(404).json({ mensaje: "Camión no encontrado." });

    const viajeActivo = await Viaje.findOne({
      where: { camionId: camion.id, estado: "en_ruta" }
    });

    if (viajeActivo) {
      return res.status(400).json({
        mensaje: "No se puede eliminar: el camión tiene un viaje activo."
      });
    }

    await camion.destroy();

    res.json({ mensaje: "Camión eliminado correctamente." });

  } catch (error) {
    console.error("Error eliminando camión:", error);
    res.status(500).json({ error: error.message });
  }
};

/* ===========================================================
   ALERTAS DE MANTENCIÓN
=========================================================== */
export const obtenerAlertasMantenimiento = async (req, res) => {
  try {
    const camiones = await Camion.findAll();

    const alertas = camiones.filter(c => {
      const diferencia = c.kmTotales - c.kmUltimaMantencion;
      return diferencia >= c.limiteMantencion;
    });

    res.json(alertas);

  } catch (error) {
    console.error("Error obteniendo alertas:", error);
    res.status(500).json({ mensaje: "Error obteniendo alertas" });
  }
};

/* ===========================================================
   REGISTRAR MANTENIMIENTO REALIZADO
=========================================================== */
export const registrarMantenimiento = async (req, res) => {
  try {
    const { camionId } = req.params; // viene desde PUT /camiones/:camionId/mantencion
    const { kmUltimaMantencion } = req.body;

    const camion = await Camion.findByPk(camionId);
    if (!camion) return res.status(404).json({ mensaje: "Camión no encontrado." });

    // ACTUALIZACIÓN CORRECTA
    camion.kmUltimaMantencion = kmUltimaMantencion;
    camion.estado = "disponible";
    camion.habilitado = true;

    await camion.save();

    res.json({ mensaje: "Mantenimiento registrado correctamente.", camion });

  } catch (error) {
    console.error("Error registrando mantenimiento:", error);
    res.status(500).json({ mensaje: "Error al registrar mantenimiento." });
  }
};
