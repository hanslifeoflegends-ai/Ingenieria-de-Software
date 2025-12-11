// ======================================================
// FUNCIÓN UNIVERSAL → Normaliza datos sin importar cómo
// venga el viaje desde el backend
// ======================================================
function mapViaje(item) {
    return {
        fecha: item.fecha ? item.fecha.toString().slice(0, 10) : "—",

        origen:
            item.origen ||
            item.Solicitud?.origen ||
            item.solicitud?.origen ||
            "—",

        destino:
            item.destino ||
            item.Solicitud?.destino ||
            item.solicitud?.destino ||
            "—",

        conductor:
            item.Conductor?.nombre ||
            item.conductor?.nombre ||
            item.conductor ||
            "—",

        ingreso:
            item.ingreso ||
            item.monto ||
            item.costo ||
            0
    };
}

// ======================================================
// BUSCAR REPORTE DIARIO
// ======================================================
document.getElementById("btnBuscar").addEventListener("click", async () => {
    const fecha = document.getElementById("fecha").value;
    const token = localStorage.getItem("token");

    const mensaje = document.getElementById("mensaje");
    const tabla = document.getElementById("tablaResultados");
    const tbody = tabla.querySelector("tbody");

    if (!fecha) {
        mensaje.textContent = "Seleccione una fecha.";
        return;
    }

    const res = await fetch(`http://localhost:3000/reportes/diario/${fecha}`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await res.json();
    tbody.innerHTML = "";

    if (!data.data || data.data.length === 0) {
        mensaje.textContent = "Sin registros";
        tabla.style.display = "none";
        document.getElementById("btnPDF").style.display = "none";
        return;
    }

    mensaje.textContent = "";
    tabla.style.display = "table";

    // ============================================
    // MAPEAR CADA REGISTRO PARA QUE NO SALGA undefined
    // ============================================
    data.data.forEach(rawItem => {

        const item = mapViaje(rawItem);

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.fecha}</td>
            <td>Transporte de Carga</td>
            <td>${item.origen}</td>
            <td>${item.destino}</td>
            <td>${item.conductor}</td>
            <td>$${item.ingreso}</td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById("btnPDF").style.display = "block";
});

// ======================================================
// GENERAR PDF
// ======================================================
document.getElementById("btnPDF").addEventListener("click", () => {
    window.print();
});
