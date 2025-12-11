import { Router } from "express";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";
import { obtenerAlertas } from "../controllers/alertas.controller.js";

const router = Router();

// Obtener alertas del sistema
router.get("/", verifyToken, verifyAdmin, obtenerAlertas);

export default router;
