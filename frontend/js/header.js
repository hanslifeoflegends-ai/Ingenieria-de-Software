// =========================================
// Cargar HEADER en todas las páginas
// =========================================
async function cargarHeader() {
    const contenedor = document.getElementById("header-container");
    if (!contenedor) return;

    const res = await fetch("../html/components/header.html");
    const html = await res.text();
    contenedor.innerHTML = html;

    inicializarSistema();
}

cargarHeader();

// =========================================
// INICIALIZAR SISTEMA
// =========================================
function inicializarSistema() {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");

    // Si NO HAY token → obligar login
    if (!token) {
        window.location.href = "/login";
        return;
    }

    protegerRutas(rol);
    configurarBotones(rol);
}

// =========================================
// PROTEGER RUTAS SEGÚN ROL
// =========================================
function protegerRutas(rol) {
    const rutaActual = window.location.pathname;

    // Rutas SOLO admin
    const rutasAdmin = [
        "/administracion",
        "/registrarCamion",
        "/registrarConductor",
        "/tarifas",
        "/reportesMenu",
        "/reportes",
        "/asignarViaje",
        "/solicitudes",
        "/carga-agricola",
        "/carga-aridos"
    ];

    // Rutas para usuarios normales
    const rutasUsuario = [
        "/menu",
        "/operaciones",
        "/inicio-viaje",
        "/fin-viaje",
        "/solicitud"
    ];

    // Usuario → no puede entrar a zonas admin
    if (rol === "usuario") {
        if (rutasAdmin.includes(rutaActual)) {
            alert("❌ No tienes permiso para acceder a esta sección.");
            window.location.href = "/menu";
        }
    }

    // Admin → acceso libre (no hacemos nada)
}

// =========================================
// MOSTRAR / OCULTAR BOTONES EN LAS PÁGINAS
// =========================================
function configurarBotones(rol) {
    const adminOnly = document.querySelectorAll(".admin-only");
    const userOnly = document.querySelectorAll(".user-only");

    if (rol === "usuario") {
        adminOnly.forEach(b => b.style.display = "none");
        userOnly.forEach(b => b.style.display = "block");
    }

    if (rol === "admin") {
        adminOnly.forEach(b => b.style.display = "block");
        userOnly.forEach(b => b.style.display = "block");
    }
}

// =========================================
// CERRAR SESIÓN
// =========================================
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");

    window.location.href = "/login";
}
