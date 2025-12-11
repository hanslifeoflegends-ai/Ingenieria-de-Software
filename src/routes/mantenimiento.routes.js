import { Router } from "express";
import { 
    registrarMantenimiento, 
    listarMantenimientos 
} from "../controllers/mantenimiento.controller.js";

import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const router = Router();

// Registrar mantenimiento (ADMIN)
router.post("/", verifyToken, verifyAdmin, registrarMantenimiento);

// Listar historial de mantenimientos (ADMIN)
router.get("/", verifyToken, verifyAdmin, listarMantenimientos);

export default router;
