import { Router } from "express";

import { 
  crearSolicitud,
  listarSolicitudesUsuario,
  listarSolicitudesAdmin,
  actualizarEstadoSolicitud,
  listarSolicitudesPendientes,
  listarSolicitudPorId   // ⭐ IMPORTACIÓN FALTANTE
} from "../controllers/solicitud.controller.js";

import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const router = Router();


// ===============================================================
// RF-2 — Crear solicitud (usuario)
// ===============================================================
router.post("/", verifyToken, crearSolicitud);


// ===============================================================
// RF-3 — Ver solo mis solicitudes (usuario)
// ===============================================================
router.get("/mis-solicitudes", verifyToken, listarSolicitudesUsuario);


// ===============================================================
// Solicitudes pendientes (solo admin, para asignar viaje)
// ===============================================================
router.get("/pendientes", verifyToken, verifyAdmin, listarSolicitudesPendientes);


// ===============================================================
// Ver detalles de una solicitud por ID (usuario o admin)
// *** ESTA RUTA DEBE IR ANTES DE "/" para evitar conflictos ***
// ===============================================================
router.get("/:id", verifyToken, listarSolicitudPorId);


// ===============================================================
// RF-3 — Ver todas las solicitudes (admin)
// ===============================================================
router.get("/", verifyToken, verifyAdmin, listarSolicitudesAdmin);


// ===============================================================
// RF-6 — Actualizar estado de solicitud (admin)
// ===============================================================
router.put("/estado", verifyToken, verifyAdmin, actualizarEstadoSolicitud);


export default router;
