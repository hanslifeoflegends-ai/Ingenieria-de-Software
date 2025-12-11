import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { calcularCosto } from "../controllers/costo.controller.js";

const router = Router();

// Cálculo automático del costo
router.post("/", verifyToken, calcularCosto);

export default router;
