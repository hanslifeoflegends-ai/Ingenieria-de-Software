const apiUrl = "http://localhost:3000/reporte-diario";


// -------------------------------
// FORMATOS BONITOS DE FECHA/HORA
// -------------------------------
function formatoFecha(f) {
    return new Date(f).toLocaleDateString("es-CL");
}

function formatoHora(f) {
    return new Date(f).toLocaleTimeString("es-CL", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
}

function formatoFechaHora(f) {
    return `${formatoFecha(f)} ${formatoHora(f)}`;
}

// -------------------------------
// GENERAR REPORTE
// -------------------------------
document.getElementById("btnGenerar").addEventListener("click", async () => {
    const fecha = document.getElementById("fechaReporte").value;

    if (!fecha) {
        alert("Debe seleccionar una fecha");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/${fecha}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        });

        if (!response.ok) {
            throw new Error("Error al obtener los datos del reporte.");
        }

        const data = await response.json();

        const tabla = document.getElementById("tablaReporte");
        const tbody = tabla.querySelector("tbody");
        const mensaje = document.getElementById("mensaje");

        tbody.innerHTML = "";
        mensaje.innerHTML = "";

        if (data.mensaje === "Sin registros") {
            tabla.style.display = "none";
            mensaje.innerHTML = "No existen servicios finalizados para esta fecha.";
            return;
        }

        tabla.style.display = "table";

        data.servicios.forEach(s => {
            const fila = `
                <tr>
                    <td>${formatoFechaHora(s.fecha_servicio)}</td>
                    <td>${s.tipo_servicio}</td>
                    <td>${s.origen}</td>
                    <td>${s.destino}</td>
                    <td>${s.conductor}</td>
                </tr>
            `;
            tbody.innerHTML += fila;
        });

        // Muestra el botón para descargar PDF
        document.getElementById("btnDescargar").style.display = "block";

    } catch (error) {
        console.error("Error generando reporte:", error);
        alert("Ocurrió un error al consultar el reporte.");
    }
});

// -------------------------------
// DESCARGAR PDF
// -------------------------------
document.getElementById("btnDescargar").addEventListener("click", async () => {
    const fecha = document.getElementById("fechaReporte").value;

    if (!fecha) {
        alert("Debe seleccionar una fecha");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/reporte-diario/pdf/${fecha}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        });

        if (!response.ok) {
            throw new Error("Error al generar el PDF.");
        }

        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Reporte_Diario_${fecha}.pdf`;
        link.click();

    } catch (error) {
        console.error("Error generando PDF:", error);
        alert("Ocurrió un error al generar el PDF.");
    }
});
