import { Router } from "express";

import { 
  registrarCamion, 
  listarCamiones, 
  listarCamionesDisponibles,
  listarCamionesEnMantenimiento,
  actualizarCamion,
  eliminarCamion,
  obtenerCamionPorId,
  registrarMantenimiento,
  obtenerAlertasMantenimiento
} from "../controllers/camion.controller.js";

import { actualizarEstadoCamion } from "../controllers/camionEstado.controller.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const router = Router();


// ⚠ RUTAS QUE NO USAN :id (DEBEN IR PRIMERO)
router.get("/mantenimiento", listarCamionesEnMantenimiento);
router.get("/alertas/mantenimiento", verifyToken, verifyAdmin, obtenerAlertasMantenimiento);


// Registrar camión (ADMIN)
router.post("/", verifyToken, verifyAdmin, registrarCamion);

// Listar todos (ADMIN)
router.get("/", verifyToken, verifyAdmin, listarCamiones);

// Registrar mantención realizada
router.put("/:camionId/mantencion", verifyToken, verifyAdmin, registrarMantenimiento);

// Listar solo disponibles
router.get("/disponibles", verifyToken, listarCamionesDisponibles);


// ⚠ RUTAS CON :id (DEBEN IR AL FINAL)
router.get("/:id", verifyToken, obtenerCamionPorId);

router.put("/estado/:camionId", verifyToken, verifyAdmin, actualizarEstadoCamion);

router.put("/:id", verifyToken, verifyAdmin, actualizarCamion);

router.delete("/:id", verifyToken, verifyAdmin, eliminarCamion);

export default router;
