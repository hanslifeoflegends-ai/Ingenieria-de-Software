const API_URL = "http://localhost:3000";
const apiUrl = "http://localhost:3000/reporte-diario";  // Verifica que esta sea la URL correcta.

// ================================
// Cargar datos desde localStorage
// ================================
document.addEventListener("DOMContentLoaded", () => {
    const km = localStorage.getItem("kmRecorridos");
    if (km) document.getElementById("distancia").value = km;

    let tipo = localStorage.getItem("tipoCarga");
    const select = document.getElementById("tipoCarga");

    if (tipo) {
        tipo = tipo.toLowerCase().trim();
        select.value = tipo;
        actualizarTarifaBase();
        select.disabled = true;
    } else {
        select.addEventListener("change", actualizarTarifaBase);
    }
});

// ================================
// Tarifa base automática
// ================================
function actualizarTarifaBase() {
    const tipo = document.getElementById("tipoCarga").value;
    const tarifaBase = document.getElementById("tarifaBase");

    if (tipo === "aridos") {
        tarifaBase.value = 35000;
        tarifaBase.disabled = true;
    } else if (tipo === "agricola") {
        tarifaBase.value = 30000;
        tarifaBase.disabled = true;
    } else {
        tarifaBase.value = "";
        tarifaBase.disabled = false;
    }

    costoCalculado = false;
}

// ================================
// GUARDAR INGRESO EN VIAJE
// ================================
async function guardarIngresoEnViaje(total) {
    const viajeId = localStorage.getItem("viajeId");

    if (!viajeId) {
        console.warn("No existe viajeId en localStorage");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/viajes/${viajeId}/ingreso`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({ ingreso: total }) // ✅ pasamos 'total' como ingreso
        });

        const data = await res.json();
        console.log("✔ Ingreso guardado:", data);

    } catch (error) {
        console.error("❌ Error guardando ingreso:", error);
    }
}

// ================================
// CALCULAR COSTO
// ================================
function calcularCosto() {
    const km = parseFloat(document.getElementById("distancia").value);
    const base = parseFloat(document.getElementById("tarifaBase").value);
    const costoKm = parseFloat(document.getElementById("costoKm").value);

    if (isNaN(km) || isNaN(base) || isNaN(costoKm)) {
        alert("Debe completar todos los campos.");
        return;
    }

    const total = base + (km * costoKm);

    alert("Costo total: $" + total.toLocaleString("es-CL"));

    localStorage.setItem("costoViaje", total);
    costoCalculado = true;

    // ✅ Guardar ingreso
    guardarIngresoEnViaje(total);

    document.getElementById("mensajeOk").style.display = "block";

    setTimeout(() => {
        document.getElementById("mensajeOk").style.display = "none";
    }, 5000);
}

// ================================
// Control de botones
// ================================
document.getElementById("btnVolver").addEventListener("click", () => {
    if (!costoCalculado) {
        document.getElementById("mensajeAlerta").style.display = "block";
        return;
    }
    location.href = "operaciones.html";
});

document.getElementById("btnLogout").addEventListener("click", () => {
    if (!costoCalculado) {
        document.getElementById("mensajeAlerta").style.display = "block";
        return;
    }
    location.href = "login.html";
});
