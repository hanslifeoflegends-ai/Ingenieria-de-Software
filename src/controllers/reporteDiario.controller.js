import { Op } from "sequelize";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Viaje from "../models/viaje.model.js";
import Camion from "../models/camion.model.js";
import Conductor from "../models/conductor.model.js";
import Solicitud from "../models/solicitud.model.js";
import Cliente from "../models/cliente.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =============================================
// OBTENER REPORTE DIARIO (JSON) SIN INGRESOS
// =============================================
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
          include: [{ model: Cliente, as: "cliente", attributes: ["nombre"] }]
        }
      ]
    });

    if (viajes.length === 0) {
      return res.json({ mensaje: "Sin registros", servicios: [] });
    }

    // Datos sin INGRESO
    const servicios = viajes.map(v => ({
      fecha_servicio: v.fechaFin,
      tipo_servicio: v.solicitudViaje?.tipo_servicio || v.tipo_carga || "General",
      origen: v.solicitudViaje?.origen || "—",
      destino: v.solicitudViaje?.destino || "—",
      conductor: v.conductor?.nombre || "—",
      camion: v.camion?.patente || "—"
    }));

    return res.json({ servicios });

  } catch (error) {
    console.error("ERROR REPORTE DIARIO:", error);
    res.status(500).json({ mensaje: "Error en el reporte" });
  }
};

// =============================================
// GENERAR PDF SIN INGRESOS
// =============================================
export const generarReporteDiarioPDF = async (req, res) => {
  try {
    const { fecha } = req.params;

    const inicio = new Date(`${fecha}T00:00:00`);
    const fin = new Date(`${fecha}T23:59:59`);

    const viajes = await Viaje.findAll({
      where: {
        estado: "finalizado",
        fechaFin: { [Op.between]: [inicio, fin] }
      },
      include: [
        { model: Conductor, as: "conductor" },
        { model: Camion, as: "camion" },
        {
          model: Solicitud,
          as: "solicitudViaje",
          attributes: ["origen", "destino"]
        }
      ]
    });

    const carpeta = path.join(__dirname, "../../pdf_reportes_diarios");
    if (!fs.existsSync(carpeta)) fs.mkdirSync(carpeta);

    const nombrePDF = `Reporte-${fecha}-${Date.now()}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${nombrePDF}`);

    const doc = new PDFDocument();
    doc.pipe(res);

    doc.fontSize(20).text("Reporte Diario de Servicios", { align: "center" });
    doc.moveDown();
    doc.text(`Fecha: ${fecha}`);
    doc.moveDown();

    viajes.forEach((v, i) => {
      doc.fontSize(14).text(`Servicio #${i + 1}`, { underline: true });
      doc.fontSize(12).text(`Origen: ${v.solicitudViaje?.origen || "—"}`);
      doc.text(`Destino: ${v.solicitudViaje?.destino || "—"}`);
      doc.text(`Conductor: ${v.conductor?.nombre || "—"}`);
      doc.text(`Camión: ${v.camion?.patente || "—"}`);
      doc.moveDown();
    });

    // ❌ Se elimina completamente TOTAL INGRESOS
    // ❌ No se muestra monto ni ingresos por servicio

    doc.end();

  } catch (error) {
    console.error("ERROR REPORTE PDF:", error);
    res.status(500).json({ mensaje: "Error generando PDF" });
  }
};
