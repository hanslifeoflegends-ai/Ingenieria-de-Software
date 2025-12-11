import { Router } from "express";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

import {
  registrarViaje,
  iniciarViaje,
  finalizarViaje,
  listarViajesEnRuta,
  listarViajesAsignados,
  historialPorCamion,
  historialPorCliente,
  obtenerViajePorId,
  guardarMontoViaje
} from "../controllers/viaje.controller.js";

const router = Router();

/* =======================================================
   RUTAS PARA CONDUCTORES
========================================================= */

// Obtener viajes asignados al conductor
router.get("/asignados", verifyToken, listarViajesAsignados);

// Registrar inicio de viaje
router.post("/inicio", verifyToken, iniciarViaje);

// Registrar fin de viaje
router.post("/fin", verifyToken, finalizarViaje);

// 🔥 RUTA QUE FALTABA — AHORA COINCIDE CON EL FRONTEND
router.put("/:viajeId/monto", verifyToken, guardarMontoViaje);

// (Opcional si la usabas antes)
router.put("/:viajeId/ingreso", verifyToken, guardarMontoViaje);

/* =======================================================
   RUTAS ADMINISTRATIVAS
========================================================= */

// Registrar viaje (asignar camión + conductor)
router.post("/", verifyToken, verifyAdmin, registrarViaje);

// Listar viajes en ruta
router.get("/en-ruta", verifyToken, verifyAdmin, listarViajesEnRuta);

// Historial por camión
router.get("/camion/:camionId", verifyToken, verifyAdmin, historialPorCamion);

// Historial por cliente
router.get("/cliente/:clienteId", verifyToken, verifyAdmin, historialPorCliente);

/* =======================================================
   OBTENER VIAJE POR ID
========================================================= */

router.get("/:id", verifyToken, obtenerViajePorId);

/* =======================================================
   EXPORTAR RUTAS
========================================================= */

export default router;
