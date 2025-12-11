import Viaje from "../models/viaje.model.js";
import Conductor from "../models/conductor.model.js";
import Camion from "../models/camion.model.js";
import Solicitud from "../models/solicitud.model.js";
import Cliente from "../models/cliente.model.js";
import Usuario from "../models/usuario.model.js";
import { Sequelize, Op } from "sequelize";


// ======================================================================
// Reporte: Viajes por Usuario
// ======================================================================
export const reporteViajesPorUsuario = async (req, res) => {
  try {
    const datos = await Viaje.findAll({
      attributes: [
        "usuarioId",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "totalViajes"]
      ],
      group: ["usuarioId"],
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["nombre", "correo"]
        }
      ]
    });
    res.json(datos);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ======================================================================
// Reporte: Viajes por Camión
// ======================================================================
export const reporteViajesPorCamion = async (req, res) => {
  try {
    const datos = await Viaje.findAll({
      attributes: [
        "camionId",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "totalViajes"]
      ],
      group: ["camionId"],
      include: [
        {
          model: Camion,
          as: "camion",
          attributes: ["patente", "marca", "modelo"]
        }
      ]
    });
    res.json(datos);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ======================================================================
// Reporte: Totales por Estado
// ======================================================================
export const reporteEstados = async (req, res) => {
  try {
    const datos = await Viaje.findAll({
      attributes: [
        "estado",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "cantidad"]
      ],
      group: ["estado"]
    });
    res.json(datos);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ======================================================================
// Reporte Diario
// ======================================================================
export const obtenerReporteDiario = async (req, res) => {
  try {
    const { fecha } = req.params;

    const viajes = await Viaje.findAll({
      where: {
        estado: "finalizado",
        fechaFin: {
          [Op.between]: [`${fecha} 00:00:00`, `${fecha} 23:59:59`]
        }
      },
      include: [
        { model: Camion, as: "camion" },
        { model: Conductor, as: "conductor" },
        {
          model: Solicitud,
          as: "solicitudViaje",
          attributes: ["origen", "destino", "tipo_servicio"],
          include: [
            { model: Cliente, as: "cliente", attributes: ["nombre"] }
          ]
        }
      ]
    });

    if (viajes.length === 0) {
      return res.json({ mensaje: "Sin registros", servicios: [], total_ingresos: 0 });
    }

    const servicios = viajes.map(v => ({
      fecha_servicio: v.fechaFin,
      tipo_servicio: v.solicitudViaje?.tipo_servicio || v.tipo_carga || "General",
      origen: v.solicitudViaje?.origen || "—",
      destino: v.solicitudViaje?.destino || "—",
      conductor: v.conductor?.nombre || "—",
      ingreso: v.ingreso || 0
    }));

    const total_ingresos = servicios.reduce((sum, s) => sum + s.ingreso, 0);

    return res.json({ servicios, total_ingresos });
  } catch (error) {
    console.error("ERROR REPORTE DIARIO:", error);
    res.status(500).json({ mensaje: "Error en el reporte" });
  }
};

// ======================================================================
// Productividad por Conductor (CORREGIDA)
// ======================================================================
export const productividadConductor = async (req, res) => {
  try {
    const { conductorId } = req.params;
    const { inicio, fin } = req.query;

    if (!inicio || !fin) {
      return res.status(400).json({ mensaje: "Debe indicar fecha inicio y fin." });
    }

    const conductor = await Conductor.findByPk(conductorId);
    if (!conductor)
      return res.status(404).json({ mensaje: "Conductor no encontrado." });

    const viajes = await Viaje.findAll({
      where: {
        conductorId,
        estado: "finalizado",
        fechaFin: {
          [Op.between]: [new Date(inicio), new Date(fin)]
        }
      },
      include: [
        {
          model: Camion,
          as: "camion",
          attributes: ["patente"]
        },
        {
          model: Solicitud,
          as: "solicitudViaje",
          include: [
            {
              model: Cliente,
              as: "cliente",
              attributes: ["nombre"]
            }
          ]
        },
        {
          model: Conductor,
          as: "conductor",
          attributes: ["nombre"]
        }
      ]
    });

    const totalViajes = viajes.length;
    const kmTotales = viajes.reduce((sum, v) => sum + (v.kmRecorridos || 0), 0);
    const ingresoTotal = viajes.reduce((sum, v) => sum + (v.ingreso || 0), 0);

    // Camión más utilizado
    const usoCamiones = {};
    viajes.forEach(v => {
      const pat = v.camion?.patente;
      if (pat) usoCamiones[pat] = (usoCamiones[pat] || 0) + 1;
    });
    const camionMasUsado =
      Object.entries(usoCamiones).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    // Carga más frecuente
    const cargas = {};
    viajes.forEach(v => {
      const tipo = v.tipo_carga || v.solicitudViaje?.tipo_servicio;
      if (tipo) cargas[tipo] = (cargas[tipo] || 0) + 1;
    });
    const cargaFrecuente =
      Object.entries(cargas).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    return res.json({
      conductor: conductor.nombre,
      totalViajes,
      kmTotales,
      ingresoTotal,
      camionMasUsado,
      cargaFrecuente,
      detalle: viajes
    });

  } catch (error) {
    console.error("ERROR REPORTE PRODUCTIVIDAD:", error);
    return res.status(500).json({ mensaje: "Error al generar reporte" });
  }
};
