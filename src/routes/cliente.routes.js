import { Router } from "express";
import Cliente from "../models/cliente.model.js";     // ← FALTA AQUÍ
import { registrarCliente, listarClientes } from "../controllers/cliente.controller.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const router = Router();

// Registrar cliente (solo admin)
router.post("/", verifyToken, verifyAdmin, registrarCliente);

// Listar clientes (solo admin)
router.get("/", verifyToken, verifyAdmin, listarClientes);

// Listar clientes para operadores (solo id y nombre)
router.get("/basico", verifyToken, async (req, res) => {
    try {
        const clientes = await Cliente.findAll({
            attributes: ["id", "nombre"]
        });

        res.json(clientes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// RUTA DE DEBUG (solo para ver si existen clientes)
router.get("/debug/all", async (req, res) => {
    try {
        const clientes = await Cliente.findAll();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
