import { Router } from "express";
import { asignarCamion } from "../controllers/asignacion.controller.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const router = Router();

// RF-5 — Asignación de camión (solo admin)
router.post("/", verifyToken, verifyAdmin, asignarCamion);

export default router;
