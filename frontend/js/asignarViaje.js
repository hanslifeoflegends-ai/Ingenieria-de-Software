console.log("🔥 asignarViaje.js cargado correctamente");

const token = localStorage.getItem("token");
const params = new URLSearchParams(window.location.search);
const solicitudId = params.get("id");

// =====================================================
// MOSTRAR MODAL
// =====================================================
function mostrarMensajeWhatsapp(conductor, camion, cliente, origen, destino, redirigir) {
    const html = `
        <h3>🚚 Nuevo Viaje Asignado</h3>
        <table>
            <tr><td><strong>Conductor:</strong></td><td>${conductor}</td></tr>
            <tr><td><strong>Camión:</strong></td><td>${camion}</td></tr>
            <tr><td><strong>Cliente:</strong></td><td>${cliente}</td></tr>
            <tr><td><strong>Origen:</strong></td><td>${origen}</td></tr>
            <tr><td><strong>Destino:</strong></td><td>${destino}</td></tr>
        </table>
    `;
    document.getElementById("modalMensaje").innerHTML = html;
    document.getElementById("modalWhatsApp").style.display = "flex";

    document.getElementById("btnWhatsOk").onclick = () => {
        document.getElementById("modalWhatsApp").style.display = "none";
        if (redirigir) window.location.href = "solicitudes.html";
    };
}

// =====================================================
// CARGAR SOLICITUD
// =====================================================
async function cargarSolicitud() {
    const res = await fetch(`http://localhost:3000/solicitudes/${solicitudId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const sol = await res.json();
    console.log("📄 Solicitud cargada:", sol);

    document.getElementById("origen").value = sol.origen;
    document.getElementById("destino").value = sol.destino;

    document.getElementById("selectCliente").innerHTML =
        `<option value="${sol.cliente.id}">${sol.cliente.nombre}</option>`;

    // ⭐ GUARDAR TIPO DE CARGA
    const tipo = sol.tipo_servicio || null;
    localStorage.setItem("tipoCarga", tipo);
    console.log("💾 Tipo de Carga guardado:", tipo);
}

// =====================================================
// CARGAR CAMIONES
// =====================================================
async function cargarCamiones() {
    const res = await fetch("http://localhost:3000/camiones/disponibles", {
        headers: { Authorization: `Bearer ${token}` },
    });
    const camiones = await res.json();

    const select = document.getElementById("selectCamion");

    // 🔥 NO seleccionar nada por defecto
    select.innerHTML = `<option value="">Seleccione un camión</option>`;

    camiones.forEach(c => {
        select.innerHTML += `<option value="${c.id}">${c.patente} (${c.capacidad} ton)</option>`;
    });
}

// =====================================================
// CARGAR CONDUCTORES
// =====================================================
async function cargarConductores() {
    const res = await fetch("http://localhost:3000/conductores", {
        headers: { Authorization: `Bearer ${token}` },
    });

    const conductores = await res.json();
    const select = document.getElementById("selectConductor");

    // 🔥 NO seleccionar nada por defecto
    select.innerHTML = `<option value="">Seleccione un conductor</option>`;

    conductores
        .filter(c => c.estado === "disponible")
        .forEach(c => {
            select.innerHTML += `<option value="${c.id}">${c.nombre} (${c.rut})</option>`;
        });
}

// =====================================================
// ASIGNAR VIAJE
// =====================================================
async function asignarViaje() {
    const tipoCarga = localStorage.getItem("tipoCarga");
    const camionId = document.getElementById("selectCamion").value;
    const conductorId = document.getElementById("selectConductor").value;

    if (!camionId || !conductorId) {
        alert("Debe seleccionar camión y conductor.");
        return;
    }

    const payload = {
        solicitudId,
        camionId,
        conductorId,
        tipo_carga: tipoCarga,
    };

    console.log("📤 Enviando payload:", payload);

    const res = await fetch("http://localhost:3000/viajes", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("📥 Respuesta backend:", data);

    mostrarMensajeWhatsapp(
        document.getElementById("selectConductor").selectedOptions[0].textContent,
        document.getElementById("selectCamion").selectedOptions[0].textContent,
        document.getElementById("selectCliente").selectedOptions[0].textContent,
        document.getElementById("origen").value,
        document.getElementById("destino").value,
        true
    );
}

// =====================================================
// INICIO
// =====================================================
cargarSolicitud();
cargarCamiones();
cargarConductores();
