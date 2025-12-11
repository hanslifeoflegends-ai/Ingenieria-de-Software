import { Router } from "express";
import {
    registrarConductor,
    listarConductores,
    actualizarEstadoConductor,
    eliminarConductor            // 👈 nuevo
} from "../controllers/conductor.controller.js";

const router = Router();

// ===============================
// RUTAS DEL MÓDULO CONDUCTOR
// ===============================

// Registrar conductor
router.post("/", registrarConductor);

// Listar conductores
router.get("/", listarConductores);

// Actualizar estado del conductor
router.put("/estado/:id", actualizarEstadoConductor);

// ===============================
// 🔥 DESPEDIR CONDUCTOR (DELETE)
// ===============================
router.delete("/:id", eliminarConductor);

export default router;
