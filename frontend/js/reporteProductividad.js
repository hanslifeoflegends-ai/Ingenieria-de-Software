const API_URL = "http://localhost:3000";

// =====================================================
// Cargar lista de conductores en el <select>
// =====================================================
async function cargarConductores() {
    try {
        const res = await fetch(`${API_URL}/conductores`);
        const conductores = await res.json();

        const select = document.getElementById("conductorId");
        select.innerHTML = `<option value="">Seleccione un conductor...</option>`;

        conductores.forEach(c => {
            select.innerHTML += `
                <option value="${c.id}">
                    ${c.nombre}
                </option>
            `;
        });

    } catch (error) {
        console.error("❌ Error cargando conductores:", error);
        alert("No se pudieron cargar los conductores.");
    }
}

// =====================================================
// Generar reporte de productividad
// =====================================================
document.getElementById("btnGenerar").addEventListener("click", async () => {
    const id = document.getElementById("conductorId").value;
    const inicio = document.getElementById("fechaInicio").value;
    const fin = document.getElementById("fechaFin").value;

    // Verificación de campos vacíos
    if (!id || !inicio || !fin) {
        alert("Debe seleccionar conductor y rango de fechas.");
        return;
    }

    try {
        const res = await fetch(
            `${API_URL}/reportes/productividad/${id}?inicio=${inicio}&fin=${fin}`
        );

        // Verificar si la respuesta fue exitosa
        if (!res.ok) {
            throw new Error("Error en la solicitud");
        }

        const data = await res.json();
        console.log("📊 REPORTE PRODUCTIVIDAD:", data);

        // Mostrar el reporte en pantalla
        mostrarReporte(data);

    } catch (error) {
        console.error("❌ Error generando reporte:", error);
        alert("No se pudo generar el reporte.");
    }
});

// =====================================================
// Mostrar resultados en pantalla (Eliminando segunda tabla)
// =====================================================
function mostrarReporte(data) {
    const resultadoDiv = document.getElementById("resultado");

    // Crear tabla para mostrar los datos de manera organizada
    let reportContent = `
        <h3>Detalles del Reporte</h3>
        <table>
            <thead>
                <tr>
                    <th>Conductor</th>
                    <th>Total Viajes</th>
                    <th>Kilómetros Totales</th>
                    <th>Ingreso Total</th>
                    <th>Camión Más Usado</th>
                    <th>Carga Frecuente</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${data.conductor}</td>
                    <td>${data.totalViajes}</td>
                    <td>${data.kmTotales}</td>
                    <td>${data.ingresoTotal}</td>
                    <td>${data.camionMasUsado}</td>
                    <td>${data.cargaFrecuente}</td>
                </tr>
            </tbody>
        </table>
    `;

    // Insertar el contenido generado en el div de resultado
    resultadoDiv.innerHTML = reportContent;
}

// =====================================================
// Inicializar
// =====================================================
cargarConductores();
