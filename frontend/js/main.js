// =============================
// VALIDAR SI HAY TOKEN
// =============================
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "html/login.html";
}

// Obtener payload del token
let payload;
try {
  payload = JSON.parse(atob(token.split(".")[1]));
} catch (e) {
  localStorage.removeItem("token");
  window.location.href = "html/login.html";
}

const rol = payload?.rol || "usuario";

// =============================
// MENÚS SEGÚN ROL
// =============================
const adminMenu = [
  { text: "Registrar Solicitud", url: "html/solicitud.html" },
  { text: "Solicitudes Pendientes", url: "html/solicitudes.html" },
  { text: "Asignar Viaje", url: "html/asignarViaje.html" },
  { text: "Registrar Camión", url: "html/registrarCamion.html" },
  { text: "Registrar Conductor", url: "html/registrarConductor.html" },
  { text: "Clientes", url: "html/register.html" },
  { text: "Tarifas", url: "html/tarifas.html" },
  { text: "Reportes", url: "html/reportes.html" },
];

const usuarioMenu = [
  { text: "Mis Solicitudes", url: "html/misSolicitudes.html" },
  { text: "Mi Perfil", url: "html/perfil.html" }
];

const menus = rol === "admin" ? adminMenu : usuarioMenu;

// =============================
// RENDER DE BOTONES PRINCIPALES
// =============================
function renderButtons() {
  const container = document.getElementById("buttonsContainer");
  menus.forEach(item => {
    const btn = document.createElement("div");
    btn.className = "action-button";
    btn.textContent = item.text;
    btn.onclick = () => window.location.href = item.url;
    container.appendChild(btn);
  });
}

// =============================
// RENDER DEL MENÚ LATERAL
// =============================
function renderSideMenu() {
  const list = document.getElementById("menuList");
  menus.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.text;
    li.onclick = () => window.location.href = item.url;
    list.appendChild(li);
  });

  // Cerrar sesión
  const liCerrar = document.createElement("li");
  liCerrar.textContent = "Cerrar sesión";
  liCerrar.style.color = "#ff4444";
  liCerrar.onclick = () => {
    localStorage.removeItem("token");
    window.location.href = "html/login.html";
  };
  list.appendChild(liCerrar);
}

// =============================
// MENÚ DESPLEGABLE
// =============================
function toggleMenu() {
  document.getElementById("sideMenu").classList.toggle("hidden");
}

// =============================
// EJECUTAR RENDER
// =============================
renderButtons();
renderSideMenu();
