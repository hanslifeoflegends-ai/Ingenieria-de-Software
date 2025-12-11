import express from "express";
import sequelize from "./config/database.js";
import { verifyToken, verifyAdmin } from "./middleware/auth.js";

import path from "path";
import { fileURLToPath } from "url";

import "./models/asociaciones.js";  // 🔥 activa todas las relaciones
import Usuario from "./models/usuario.model.js";
import Viaje from "./models/viaje.model.js";
import Camion from "./models/camion.model.js";
import Solicitud from "./models/solicitud.model.js";
import Cliente from "./models/cliente.model.js";

import bodyParser from 'body-parser';


// ******* 🔥 AGREGAR ESTO (IMPORTANTE) ********
import "./models/asociaciones.js";
// *********************************************

import bcrypt from "bcrypt";

// RUTAS API
import clienteRoutes from "./routes/cliente.routes.js";
import authRoutes from "./routes/auth.routes.js";
import solicitudRoutes from "./routes/solicitud.routes.js";
import camionRoutes from "./routes/camion.routes.js";
import asignacionRoutes from "./routes/asignacion.routes.js";
import conductorRoutes from "./routes/conductor.routes.js";
import viajeRoutes from "./routes/viaje.routes.js";
import reporteRoutes from "./routes/reporte.routes.js";
import ordenRoutes from "./routes/orden.routes.js";
import alertasRoutes from "./routes/alertas.routes.js";
import reporteDiarioRoutes from "./routes/reporteDiario.routes.js";
import tarifaRoutes from "./routes/tarifa.routes.js";
import costoRoutes from "./routes/costo.routes.js";
import camionEstadoRoutes from "./routes/camionEstado.routes.js";
import mantenimientoRoutes from "./routes/mantenimiento.routes.js";

const app = express();

// =========================================================
// CONFIGURACIÓN DE PATHS
// =========================================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Middlewares
app.use(bodyParser.json()); // Para manejar JSON en las peticiones

// Rutas
app.use('/reportes', reporteRoutes); // Agregamos las rutas de reportes bajo el prefijo '/reportes'
// =========================================================
// BODY PARSER
// =========================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================================================
// ARCHIVOS ESTÁTICOS (Frontend completo)
// =========================================================
app.use(express.static(path.join(__dirname, "../frontend")));

// =========================================================
// RUTAS PÚBLICAS
// =========================================================

app.get("/login", (req, res) => {
    res.sendFile(path.resolve("frontend/html/login.html"));
});

app.get("/register", (req, res) => {
    res.sendFile(path.resolve("frontend/html/register.html"));
});

app.get("/recuperar", (req, res) => {
    res.sendFile(path.resolve("frontend/html/recuperar.html"));
});

// 🔥 **AÑADIDO EN EL LUGAR CORRECTO**
app.use("/mantenimiento", mantenimientoRoutes);

// =========================================================
// RUTAS PROTEGIDAS — MENÚS
// =========================================================

app.get("/menu", verifyToken, (req, res) => {
    res.sendFile(path.resolve("frontend/html/menu.html"));
});

app.get("/menu-usuario", verifyToken, (req, res) => {
    res.sendFile(path.resolve("frontend/html/menu-usuario.html"));
});

app.get("/operaciones", verifyToken, (req, res) => {
    res.sendFile(path.resolve("frontend/html/operaciones.html"));
});

app.get("/inicio-viaje", verifyToken, (req, res) => {
    res.sendFile(path.resolve("frontend/html/inicio-viaje.html"));
});

app.get("/fin-viaje", verifyToken, (req, res) => {
    res.sendFile(path.resolve("frontend/html/fin-viaje.html"));
});

// =========================================================
// RUTAS ADMIN
// =========================================================

app.get("/administracion", verifyToken, verifyAdmin, (req, res) => {
    res.sendFile(path.resolve("frontend/html/administracion.html"));
});

app.get("/registrarCamion", verifyToken, verifyAdmin, (req, res) => {
    res.sendFile(path.resolve("frontend/html/registrarCamion.html"));
});

app.get("/registrarConductor", verifyToken, verifyAdmin, (req, res) => {
    res.sendFile(path.resolve("frontend/html/registrarConductor.html"));
});

app.get("/tarifas", verifyToken, verifyAdmin, (req, res) => {
    res.sendFile(path.resolve("frontend/html/tarifas.html"));
});

app.get("/reportesMenu", verifyToken, verifyAdmin, (req, res) => {
    res.sendFile(path.resolve("frontend/html/reportesMenu.html"));
});

app.get("/reportes", verifyToken, verifyAdmin, (req, res) => {
    res.sendFile(path.resolve("frontend/html/reportes.html"));
});

app.get("/asignarViaje", verifyToken, verifyAdmin, (req, res) => {
    res.sendFile(path.resolve("frontend/html/asignarViaje.html"));
});


// =========================================================
// DEFAULT
// =========================================================
app.get("/", (req, res) => {
    res.sendFile(path.resolve("frontend/html/login.html"));
});

// =========================================================
// API ROUTES
// =========================================================
app.use("/clientes", clienteRoutes);
app.use("/auth", authRoutes);
app.use("/solicitudes", solicitudRoutes);
app.use("/camiones", camionRoutes);
app.use("/asignaciones", asignacionRoutes);
app.use("/conductores", conductorRoutes);
app.use("/viajes", viajeRoutes);
app.use("/reportes", reporteRoutes);
app.use("/orden", ordenRoutes);
app.use("/alertas", alertasRoutes);
app.use("/reporte-diario", reporteDiarioRoutes);
app.use("/api/tarifas", tarifaRoutes);  // Prefijo /api
app.use("/costo", costoRoutes);
app.use("/camiones-estado", camionEstadoRoutes);

// =========================================================
// RELACIONES BD (pueden quedarse aquí, NO afectan nada)
// =========================================================

Usuario.hasMany(Viaje, { foreignKey: "usuarioId" });
Viaje.belongsTo(Usuario, { foreignKey: "usuarioId" });

Camion.hasMany(Viaje, { foreignKey: "camionId" });
Viaje.belongsTo(Camion, { foreignKey: "camionId" });

Cliente.hasMany(Solicitud, { foreignKey: "clienteId" });
Solicitud.belongsTo(Cliente, { foreignKey: "clienteId" });

Usuario.hasMany(Solicitud, { foreignKey: "usuarioId" });
Solicitud.belongsTo(Usuario, { foreignKey: "usuarioId" });

// =========================================================
// INICIAR SERVIDOR + CREAR ADMIN
// =========================================================

sequelize.sync().then(async () => {
    console.log("Base de datos sincronizada.");

    const adminCorreo = "admin@empresa.cl";
    const adminExiste = await Usuario.findOne({ where: { correo: adminCorreo } });

    if (!adminExiste) {
        await Usuario.create({
            nombre: "Administrador",
            correo: adminCorreo,
            contraseña: await bcrypt.hash("admin123", 10),
            rol: "admin",
        });

        console.log("Administrador creado (admin@empresa.cl / admin123)");
    }

    app.listen(3000, () => {
        console.log("🚀 Servidor corriendo en http://localhost:3000");
    });
});
