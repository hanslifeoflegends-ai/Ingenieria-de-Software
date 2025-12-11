const API_URL = "http://localhost:3000/camiones/alertas/mantenimiento";

// Cargar alertas de mantenimiento
async function cargarAlertas() {
    try {
        const res = await fetch(API_URL, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        });

        const datos = await res.json();
        const tbody = document.querySelector("#tablaAlertas tbody");
        const btnMantencion = document.getElementById("btnMantencionRealizada");

        tbody.innerHTML = "";
        btnMantencion.style.display = "none"; // Ocultar siempre inicialmente

        if (datos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="color: green; font-weight: bold;">
                        ✔ No hay camiones que requieran mantención.
                    </td>
                </tr>
            `;
            return;
        }

        datos.forEach(c => {
            const diferencia = c.kmTotales - c.kmUltimaMantencion;

            tbody.innerHTML += `
                <tr>
                    <td>${c.patente}</td>
                    <td>${c.kmTotales} km</td>
                    <td>${c.kmUltimaMantencion} km</td>
                    <td style="color:red; font-weight:bold;">${diferencia} km</td>
                    <td><span class="alert-icon">⚠ Mantención necesaria</span></td>
                </tr>
            `;

            // Mostrar botón de mantención realizada SOLO una vez
            btnMantencion.style.display = "inline-block";
            btnMantencion.setAttribute("data-camion-id", c.id);
        });

    } catch (error) {
        console.error("Error cargando alertas:", error);
        alert("No se pudieron cargar las alertas de mantención.");
    }
}

// Al hacer clic en "Mantenimiento Realizado"
document.getElementById("btnMantencionRealizada").addEventListener("click", async () => {
    const camionId = document.getElementById("btnMantencionRealizada").getAttribute("data-camion-id");

    try {
        // Traer datos del camión
        const resCamion = await fetch(`http://localhost:3000/camiones/${camionId}`, {
            headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
        });

        const camion = await resCamion.json();
        const kmActuales = camion.kmTotales;

        // Enviar actualización
        const res = await fetch(`http://localhost:3000/camiones/${camionId}/mantencion`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                kmUltimaMantencion: kmActuales,
                estado: "disponible"
            })
        });

        const data = await res.json();

        if (res.ok) {
            alert("Mantenimiento registrado exitosamente.");
            cargarAlertas();
        } else {
            alert("Error al actualizar el mantenimiento.");
        }

    } catch (error) {
        console.error("Error actualizando el mantenimiento:", error);
        alert("Ocurrió un error al registrar el mantenimiento.");
    }
});

// Cargar alertas al iniciar página
document.addEventListener("DOMContentLoaded", cargarAlertas);
