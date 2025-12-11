import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import Cliente from "../models/cliente.model.js";
import Camion from "../models/camion.model.js";
import Conductor from "../models/conductor.model.js";
import Solicitud from "../models/solicitud.model.js";
import Viaje from "../models/viaje.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generarOrdenPDF = async (req, res) => {
  try {
    const { viajeId } = req.params;

    // 1) Buscar viaje
    const viaje = await Viaje.findByPk(viajeId, {
      include: [
        { model: Solicitud, include: [Cliente] },
        Camion,
        Conductor
      ]
    });

    if (!viaje) {
      return res.status(404).json({ message: "Viaje no encontrado" });
    }

    const solicitud = viaje.Solicitud;
    const cliente = solicitud?.Cliente;
    const camion = viaje.Camion;
    const conductor = viaje.Conductor;

    // 2) Validaciones RF-15
    if (!cliente) {
      return res.status(400).json({ message: "El viaje no tiene cliente válido." });
    }

    if (!camion) {
      return res.status(400).json({ message: "El viaje no tiene camión asignado." });
    }

    if (!conductor) {
      return res.status(400).json({ message: "El viaje no tiene conductor asignado." });
    }

    if (!solicitud.tipoCarga) {
      return res.status(400).json({ message: "La solicitud no tiene tipo de carga registrado." });
    }

    // 3) Generar número único de orden
    const numeroOrden = `OT-${Date.now()}`;

    // 4) Definir ruta donde guardaremos la copia en el servidor
    const carpeta = path.join(__dirname, "../../pdf_ordenes");
    if (!fs.existsSync(carpeta)) {
      fs.mkdirSync(carpeta);
    }

    const rutaPDF = path.join(carpeta, `${numeroOrden}.pdf`);

    // 5) Crear documento
    const doc = new PDFDocument();

    // Guardar copia en servidor
    const stream = fs.createWriteStream(rutaPDF);
    doc.pipe(stream);

    // Enviar PDF al cliente también
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${numeroOrden}.pdf`);
    doc.pipe(res);

    // 6) Contenido del PDF
    doc.fontSize(20).text("ORDEN DE TRANSPORTE", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Número de orden: ${numeroOrden}`);
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    doc.fontSize(14).text("Datos del Cliente:");
    doc.fontSize(12).text(`Nombre: ${cliente.nombre}`);
    doc.text(`Teléfono: ${cliente.telefono}`);
    doc.text(`Dirección: ${cliente.direccion}`);
    doc.moveDown();

    doc.fontSize(14).text("Datos del Viaje:");
    doc.fontSize(12).text(`Origen: ${solicitud.origen}`);
    doc.text(`Destino: ${solicitud.destino}`);
    doc.text(`Tipo de carga: ${solicitud.tipoCarga}`);
    doc.text(`Distancia: ${viaje.distancia} km`);
    doc.moveDown();

    doc.fontSize(14).text("Camión Asignado:");
    doc.fontSize(12).text(`Patente: ${camion.patente}`);
    doc.text(`Marca: ${camion.marca}`);
    doc.text(`Modelo: ${camion.modelo}`);
    doc.moveDown();

    doc.fontSize(14).text("Conductor:");
    doc.fontSize(12).text(`Nombre: ${conductor.nombre}`);
    doc.text(`RUT: ${conductor.rut}`);
    doc.text(`Teléfono: ${conductor.telefono}`);
    doc.moveDown();

    doc.fontSize(12).text("Firma Operador: ________________________");
    doc.moveDown();

    doc.end();

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error generando PDF" });
  }
};
