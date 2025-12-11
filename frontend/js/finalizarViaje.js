// =====================================================
// Cargar viajes en ruta
// =====================================================
async function cargarViajes() {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:3000/viajes/en-ruta", {
            headers: { "Authorization": "Bearer " + token }
        });

        const viajes = await res.json();
        const select = document.getElementById("viajeId");
        select.innerHTML = '<option value="">Seleccione un viaje</option>';

        viajes.forEach(v => {
            const cliente = v.solicitudViaje?.cliente?.nombre || "Sin cliente";
            const destino = v.solicitudViaje?.destino || "";
            const origen = v.solicitudViaje?.origen || "";
            const tipoCarga = v.tipo_carga || "";

            select.innerHTML += `
                <option 
                    value="${v.id}"
                    data-destino="${destino}"
                    data-origen="${origen}"
                    data-tipo-carga="${tipoCarga}">
                        Viaje #${v.id} — ${cliente}
                </option>
            `;
        });

    } catch (err) {
        console.error("❌ Error cargando viajes:", err);
        alert("Error cargando viajes.");
    }
}

// =====================================================
// GUARDAR viajeId EN LOCALSTORAGE AL SELECCIONAR
// =====================================================
document.getElementById("viajeId").addEventListener("change", function () {
    const viajeId = this.value;

    if (viajeId) {
        localStorage.setItem("viajeId", viajeId);
        console.log("✔ viajeId guardado en localStorage:", viajeId);
    }

    // Autocompletar destino y hora
    const opt = this.options[this.selectedIndex];
    if (!opt.value) return;

    document.getElementById("ubicacionFinal").value = opt.dataset.destino || "";

    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById("horaFin").value = now.toISOString().slice(0, 16);
});

// =====================================================
// Finalizar viaje — versión definitiva
// =====================================================
async function finalizarViaje() {
    const viajeId = document.getElementById("viajeId").value;
    const fechaFin = document.getElementById("horaFin").value;
    const ubicacionFinal = document.getElementById("ubicacionFinal").value.trim();
    const kmRecorridos = Number(document.getElementById("kmRecorridos").value);

    if (!viajeId || !fechaFin || !ubicacionFinal || kmRecorridos <= 0) {
        alert("Debe completar todos los campos.");
        return;
    }

    try {
        const token = localStorage.getItem("token");
        const opt = document.getElementById("viajeId").selectedOptions[0];
        
        const tipoCarga = opt.dataset.tipoCarga || "general";

        // Guardar datos para tarifas.html
        localStorage.setItem("kmRecorridos", kmRecorridos);
        localStorage.setItem("tipoCarga", tipoCarga);

        const res = await fetch("http://localhost:3000/viajes/fin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                viajeId,
                fechaFin,
                ubicacionFinal,
                kmRecorridos,
                tipoCarga
            })
        });

        const data = await res.json();
        if (!res.ok) {
            alert(data?.mensaje || "Error al finalizar viaje.");
            return;
        }

        alert("✔ Viaje finalizado correctamente.");
        window.location.href = "tarifas.html";

    } catch (error) {
        console.error("❌ Error:", error);
        alert("Error al finalizar viaje.");
    }
}

// Inicializar
cargarViajes();
