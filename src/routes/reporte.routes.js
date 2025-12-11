import express from 'express';
import { reporteViajesPorUsuario, reporteViajesPorCamion, reporteEstados, obtenerReporteDiario, productividadConductor } from '../controllers/reporte.controller.js'; // Asegúrate de importar el controlador correcto

const router = express.Router();

// Ruta para obtener el reporte de productividad por conductor
router.get('/productividad/:conductorId', productividadConductor);

// Otras rutas de reportes...
router.get('/viajes-usuario', reporteViajesPorUsuario);
router.get('/viajes-camion', reporteViajesPorCamion);
router.get('/estado-viaje', reporteEstados);
router.get('/reporte-diario/:fecha', obtenerReporteDiario);

export default router;
