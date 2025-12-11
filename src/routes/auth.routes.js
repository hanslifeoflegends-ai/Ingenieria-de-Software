import { Router } from "express";
import {
  registrarUsuarioPublico,
  iniciarSesion,
  solicitarCodigo,
  cambiarContraseña
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/registro", registrarUsuarioPublico);
router.post("/login", iniciarSesion);
router.post("/recuperar", solicitarCodigo);
router.post("/cambiar", cambiarContraseña);

export default router;
