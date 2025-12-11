import Usuario from "../models/usuario.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET = "clave_super_secreta_123"; // Se moverá a .env después

// =======================================================
// REGISTRO DE USUARIO NORMAL
// =======================================================
export const registrarUsuarioPublico = async (req, res) => {
  try {
    let { nombre, correo, contraseña } = req.body;

    if (!nombre || !correo || !contraseña) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios." });
    }

    // Normalizar
    correo = correo.toLowerCase().trim();

    const existe = await Usuario.findOne({ where: { correo } });
    if (existe) {
      return res.status(400).json({ mensaje: "El correo ya está registrado." });
    }

    const hash = await bcrypt.hash(contraseña, 10);

    const usuario = await Usuario.create({
      nombre: nombre.trim(),
      correo,
      contraseña: hash,
      rol: "usuario"
    });

    return res.json({
      mensaje: "Usuario registrado con éxito",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error("Error registrando usuario:", error);
    return res.status(500).json({ error: error.message });
  }
};

// =======================================================
// LOGIN
// =======================================================
export const iniciarSesion = async (req, res) => {
  try {
    let { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
      return res.status(400).json({ mensaje: "Debe ingresar correo y contraseña." });
    }

    correo = correo.toLowerCase().trim();

    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario) {
      return res.status(400).json({ mensaje: "Correo incorrecto." });
    }

    const valido = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!valido) {
      return res.status(400).json({ mensaje: "Contraseña incorrecta." });
    }

    // Token mejorado
    const token = jwt.sign(
      {
        id: usuario.id,
        rol: usuario.rol,
        correo: usuario.correo,   // 🔥 IMPORTANTE: algunos controladores usan el correo
        nombre: usuario.nombre
      },
      SECRET,
      { expiresIn: "3h" }
    );

    return res.json({
      mensaje: "Acceso concedido",
      token,
      rol: usuario.rol
    });

  } catch (error) {
    console.error("Error login:", error);
    return res.status(500).json({ error: error.message });
  }
};

// =======================================================
// SOLICITAR CÓDIGO DE RECUPERACIÓN
// =======================================================
export const solicitarCodigo = async (req, res) => {
  let { correo } = req.body;

  if (!correo) {
    return res.status(400).json({ mensaje: "Debe ingresar un correo." });
  }

  correo = correo.toLowerCase().trim();

  const usuario = await Usuario.findOne({ where: { correo } });

  if (!usuario) {
    return res.status(400).json({ mensaje: "Correo no encontrado." });
  }

  const codigo = Math.floor(100000 + Math.random() * 900000).toString();

  usuario.codigoTemporal = codigo;
  await usuario.save();

  return res.json({
    mensaje: "Código generado correctamente",
    codigoTemporal: codigo  // Simulamos envío por correo
  });
};

// =======================================================
// CAMBIAR CONTRASEÑA
// =======================================================
export const cambiarContraseña = async (req, res) => {
  let { correo, codigoTemporal, nuevaContraseña } = req.body;

  if (!correo || !codigoTemporal || !nuevaContraseña) {
    return res.status(400).json({ mensaje: "Datos incompletos." });
  }

  correo = correo.toLowerCase().trim();

  const usuario = await Usuario.findOne({ where: { correo } });

  if (!usuario) {
    return res.status(400).json({ mensaje: "Correo inválido." });
  }

  if (usuario.codigoTemporal !== codigoTemporal) {
    return res.status(400).json({ mensaje: "Código incorrecto." });
  }

  usuario.contraseña = await bcrypt.hash(nuevaContraseña, 10);
  usuario.codigoTemporal = null;
  await usuario.save();

  return res.json({ mensaje: "Contraseña actualizada correctamente" });
};
