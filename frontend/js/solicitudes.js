// ======================================================
// AL CARGAR LA PÁGINA → cargar todas las solicitudes
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
    cargarSolicitudes();

    document.getElementById("btnBuscar").addEventListener("click", filtrarPorCliente);
});


// ======================================================
// NORMALIZAR FECHA A YYYY-MM-DD (evita errores)
// ======================================================
function normalizarFecha(f) {
    if (!f) return ""; // evita crash si la fecha viene null
    try {
        return new Date(f).toISOString().slice(0, 10);
    } catch {
        return f;
    }
}


// ======================================================
// CARGAR SOLO SOLICITUDES DEL ADMIN PARA HOY
// ======================================================
async function cargarSolicitudes() {
    const token = localStorage.getItem("token");
    const tbody = document.getElementById("tbodySolicitudes");

    try {
        const res = await fetch("/solicitudes", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        let solicitudes = await res.json();
        tbody.innerHTML = "";

        const hoy = new Date().toISOString().slice(0, 10);

        solicitudes = solicitudes.filter(s => normalizarFecha(s.fecha) === hoy);

        // Guardamos todas para buscador
        window.SOLICITUDES = solicitudes;

        if (solicitudes.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8">No hay solicitudes para el día de hoy.</td>
                </tr>
            `;
            return;
        }

        solicitudes.forEach(s => {
            const clienteNombre = s.Cliente?.nombre || "Sin cliente";

            // Si está PENDIENTE → botón gris (bloqueado)
            // Si está NUEVA → botón azul (asignable)
            const esAsignable = s.estado === "nueva";

            tbody.innerHTML += `
                <tr>
                    <td>${s.id}</td>
                    <td>${clienteNombre}</td>
                    <td>${s.tipo_servicio || s.tipoCarga || "—"}</td>
                    <td>${normalizarFecha(s.fecha)}</td>
                    <td>${s.origen}</td>
                    <td>${s.destino}</td>
                    <td>${s.estado}</td>
                    <td>
                        <button
                            class="btn ${esAsignable ? "" : "btn-disabled"}"
                            onclick="${esAsignable ? `verSolicitud(${s.id})` : ""}"
                            ${esAsignable ? "" : "disabled"}
                        >
                            Ver / Asignar
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Error cargando solicitudes:", error);

        tbody.innerHTML = `
            <tr>
                <td colspan="8">Error al cargar solicitudes.</td>
            </tr>
        `;
    }
}


// ======================================================
// BUSCADOR DE CLIENTE
// ======================================================
function filtrarPorCliente() {
    const texto = document.getElementById("buscarCliente").value.toLowerCase();
    const tbody = document.getElementById("tbodySolicitudes");

    if (!window.SOLICITUDES) return;

    const filtradas = window.SOLICITUDES.filter(s =>
        (s.Cliente?.nombre || "").toLowerCase().includes(texto)
    );

    tbody.innerHTML = "";

    if (filtradas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8">No se encontraron solicitudes.</td>
            </tr>
        `;
        return;
    }

    filtradas.forEach(s => {
        const esAsignable = s.estado === "nueva";

        tbody.innerHTML += `
            <tr>
                <td>${s.id}</td>
                <td>${s.Cliente?.nombre || "Sin cliente"}</td>
                <td>${s.tipo_servicio || s.tipoCarga || "—"}</td>
                <td>${normalizarFecha(s.fecha)}</td>
                <td>${s.origen}</td>
                <td>${s.destino}</td>
                <td>${s.estado}</td>
                <td>
                    <button
                        class="btn ${esAsignable ? "" : "btn-disabled"}"
                        onclick="${esAsignable ? `verSolicitud(${s.id})` : ""}"
                        ${esAsignable ? "" : "disabled"}
                    >
                        Ver / Asignar
                    </button>
                </td>
            </tr>
        `;
    });
}


// ======================================================
// REDIRECCIÓN A ASIGNACIÓN
// ======================================================
function verSolicitud(id) {
    window.location.href = `asignarViaje.html?id=${id}`;
}
