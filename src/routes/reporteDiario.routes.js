import { Router } from "express";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";
import { generarReporteDiarioPDF, obtenerReporteDiario } from "../controllers/reporteDiario.controller.js";

const router = Router();

// Obtener datos del reporte (JSON)
router.get("/:fecha", verifyToken, verifyAdmin, obtenerReporteDiario);

// Descargar PDF
router.get("/pdf/:fecha", verifyToken, verifyAdmin, generarReporteDiarioPDF);

export default router;
