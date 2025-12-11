    // =======================================================
    // FUNCIÓN UNIVERSAL PARA MAPEAR VIAJES
    // =======================================================
    function mapViaje(v) {
        return {
            id: v.id,
            fecha: v.fecha ? v.fecha.toString().slice(0, 10) : "—",

            origen:
                v.origen ||
                v.solicitudViaje?.origen ||
                v.solicitud?.origen ||
                "—",

            destino:
                v.destino ||
                v.solicitudViaje?.destino ||
                v.solicitud?.destino ||
                "—",

            // EL BACKEND ENVÍA: cliente: "nombre"
            cliente: v.cliente || 
                    v.solicitudViaje?.cliente?.nombre ||
                    "—",

            conductor:
                v.conductor?.nombre ||
                v.Conductor?.nombre ||
                v.conductor ||
                "—",

            estado: v.estado || "—"
        };
    }



    // =======================================================
    // CARGAR CAMIONES
    // =======================================================
    async function cargarCamiones() {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("/camiones", {
                headers: { "Authorization": `Bearer ${token}` }
            });

            const camiones = await res.json();
            const select = document.getElementById("camion");

            camiones.forEach(c => {
                const option = document.createElement("option");
                option.value = c.id;
                option.textContent = `${c.patente} (${c.modelo || c.capacidad + " ton"})`;
                select.appendChild(option);
            });

        } catch (error) {
            console.error("Error cargando camiones:", error);
            alert("No se pudieron cargar los camiones.");
        }
    }

    // =======================================================
    // CARGAR HISTORIAL DEL CAMIÓN
    // =======================================================
    async function cargarHistorial() {
        const id = document.getElementById("camion").value;
        if (!id) return alert("Seleccione un camión.");

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`/viajes/camion/${id}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            const data = await res.json();
            const tbody = document.querySelector("#tablaHistorial tbody");
            tbody.innerHTML = "";

            if (!Array.isArray(data) || data.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7">No hay viajes registrados.</td></tr>`;
                return;
            }

            data.forEach(raw => {
                const v = mapViaje(raw);

                tbody.innerHTML += `
                    <tr>
                        <td>${v.id}</td>
                        <td>${v.fecha}</td>
                        <td>${v.origen}</td>
                        <td>${v.destino}</td>
                        <td>${v.cliente}</td>
                        <td>${v.conductor}</td>
                        <td>${v.estado}</td>
                    </tr>
                `;
            });

        } catch (error) {
            console.error("Error cargando historial:", error);
            alert("No se pudo cargar el historial.");
        }
    }

    cargarCamiones();
