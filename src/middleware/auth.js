import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "clave_super_secreta_123"; // Deberías utilizar una variable de entorno para la clave secreta.

// =============================================
// VERIFICAR TOKEN
// =============================================
export const verifyToken = (req, res, next) => {
  // Intentamos obtener el token de los encabezados de la solicitud
  const header = req.headers.authorization || req.headers.Authorization || req.headers.AUTHORIZATION;

  // Si no se envió el token en los encabezados
  if (!header) {
    return res.status(401).json({ mensaje: "Token no enviado" });
  }

  // Aseguramos que el token tenga el formato "Bearer <token>"
  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ mensaje: "Formato de token inválido" });
  }

  const token = parts[1];

  try {
    // Verificamos el token con la clave secreta
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // Almacenamos la información del usuario decodificada en `req.user`
    next(); // Continuamos al siguiente middleware o controlador
  } catch (error) {
    return res.status(401).json({ mensaje: "Token inválido o expirado" });
  }
};

// =============================================
// SOLO ADMIN
// =============================================
export const verifyAdmin = (req, res, next) => {
  // Verificamos si el usuario tiene el rol "admin"
  if (!req.user || req.user.rol !== "admin") {
    return res.status(403).json({ mensaje: "Acceso denegado: solo administradores" });
  }
  next(); // Si es administrador, pasamos al siguiente middleware o controlador
};

// =============================================
// SOLO USUARIO NORMAL
// =============================================
export const verifyUser = (req, res, next) => {
  // Verificamos si el usuario tiene el rol "usuario"
  if (!req.user || req.user.rol !== "usuario") {
    return res.status(403).json({ mensaje: "Acceso denegado: solo usuarios" });
  }
  next(); // Si es un usuario normal, pasamos al siguiente middleware o controlador
};

// =============================================
// CUALQUIER USUARIO LOGUEADO
// =============================================
export const verifyAny = (req, res, next) => {
  // Verificamos si el usuario está autenticado
  if (!req.user) {
    return res.status(403).json({ mensaje: "Acceso denegado" });
  }
  next(); // Si está autenticado, pasamos al siguiente middleware o controlador
};
