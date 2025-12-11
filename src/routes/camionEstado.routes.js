import { Router } from "express";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";
import { actualizarEstadoCamion } from "../controllers/camionEstado.controller.js";

const router = Router();

router.put("/:camionId/estado", verifyToken, verifyAdmin, actualizarEstadoCamion);

export default router;
