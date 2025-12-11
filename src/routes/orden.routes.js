import { Router } from "express";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";
import { generarOrdenPDF } from "../controllers/orden.controller.js";

const router = Router();

// Genera la orden PDF y la envía al usuario + guarda copia en servidor
router.get("/:viajeId/pdf", verifyToken, verifyAdmin, generarOrdenPDF);

export default router;
