// =====================================================
//  VARIABLES GLOBALES
// =====================================================
let viajesGlobal = [];

// =====================================================
//  CARGAR VIAJES ASIGNADOS (estado = pendiente)
// =====================================================
async function cargarViajes() {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:3000/viajes/asignados", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!res.ok) {
            document.getElementById("viajeId").innerHTML =
                '<option value="">Error al cargar viajes</option>';
            return;
        }

        const viajes = await res.json();
        viajesGlobal = viajes;

        console.log("📌 Viajes recibidos:", viajesGlobal);

        const select = document.getElementById("viajeId");
        select.innerHTML = '<option value="" selected disabled>Seleccione un viaje</option>';

        viajes.forEach(v => {
            const opt = document.createElement("option");
            opt.value = v.id;

            // No usamos tipo_servicio porque no viene desde el backend
            opt.dataset.origen = v.origen || "";

            opt.textContent = `Viaje #${v.id} - ${v.cliente}`;
            select.appendChild(opt);
        });

    } catch (error) {
        console.error("Error cargando viajes:", error);
        document.getElementById("viajeId").innerHTML =
            '<option value="">Error de conexión</option>';
    }
}

// =====================================================
// AUTOCOMPLETAR INICIO DE VIAJE
// =====================================================
document.getElementById("viajeId").addEventListener("change", function () {
    const viajeID = this.value;
    const viaje = viajesGlobal.find(v => v.id == viajeID);

    if (!viaje) return;

    console.log("➡ Viaje seleccionado:", viaje);

    // Hora actual
    const ahora = new Date();
    ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
    document.getElementById("horaInicio").value = ahora.toISOString().slice(0, 16);

    // Origen desde la solicitud
    document.getElementById("ubicacion").value = viaje.origen || "";
});

// =====================================================
// REGISTRAR INICIO DE VIAJE
// =====================================================
async function registrarInicio() {
    const data = {
        viajeId: document.getElementById("viajeId").value,
        fechaInicio: document.getElementById("horaInicio").value,
        ubicacionInicio: document.getElementById("ubicacion").value
    };

    if (!data.viajeId) return alert("Debe seleccionar un viaje.");
    if (!data.fechaInicio) return alert("Debe ingresar la hora de inicio.");
    if (!data.ubicacionInicio.trim()) return alert("Debe ingresar la ubicación de inicio.");

    try {
        const res = await fetch("http://localhost:3000/viajes/inicio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify(data)
        });

        const body = await res.json();

        if (res.ok) {
            alert("✔ Viaje iniciado correctamente");
            window.location.href = "operaciones.html";
        } else {
            alert("❌ Error: " + (body.mensaje || "No se pudo iniciar el viaje"));
        }

    } catch (e) {
        console.error("Error:", e);
        alert("❌ Error conectando con el servidor");
    }
}

// =====================================================
// INICIALIZAR
// =====================================================
cargarViajes();
