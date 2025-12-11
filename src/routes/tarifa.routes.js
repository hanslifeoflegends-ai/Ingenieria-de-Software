// tarifa.routes.js
import { Router } from "express";
import { registrarTarifa } from "../controllers/tarifa.controller.js";  // Asegúrate de que esta ruta esté bien

const router = Router();

// Ruta para registrar una tarifa
router.post("/", registrarTarifa);

export default router;
