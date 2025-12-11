document.addEventListener("DOMContentLoaded", () => {
    cargarConductores();
});

async function cargarConductores() {
    const token = localStorage.getItem("token");
    const tabla = document.getElementById("tablaConductores");

    try {
        const res = await fetch("http://localhost:3000/conductores", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();
        tabla.innerHTML = "";

        data.forEach(c => {

            const estaOcupado = c.estado === "ocupado" || c.tieneViajeActivo;

            // 🔥 MENSAJE CUANDO EL CONDUCTOR ESTÁ EN RUTA
            const mensajeRuta = estaOcupado
                ? `<span style="color:red; font-weight:bold;">🚚 Conductor actualmente en ruta</span>`
                : "";

            // 🎨 COLOR DE TEXTO SEGÚN ESTADO
            const estadoColor = c.estado === "disponible"
                ? `<strong style="color:green;">${c.estado}</strong>`
                : `<strong style="color:red;">${c.estado}</strong>`;

            // 🔧 SELECT ESTADO (DESHABILITADO SI ESTÁ OCUPADO)
            const selectEstado = estaOcupado
                ? `
                    <select disabled class="disabled-select">
                        <option selected>Ocupado</option>
                    </select>
                `
                : `
                    <select onchange="actualizarEstado(${c.id}, this.value)">
                        <option value="disponible" ${c.estado === "disponible" ? "selected" : ""}>Disponible</option>
                        <option value="descanso" ${c.estado === "descanso" ? "selected" : ""}>Descanso</option>
                    </select>
                `;

            // 🧱 CONSTRUCCIÓN FILA
            tabla.innerHTML += `
                <tr>
                    <td>${c.nombre}</td>
                    <td>${c.rut}</td>
                    <td>${c.licencia}</td>

                    <td>
                        ${estadoColor}<br>
                        ${mensajeRuta}
                    </td>

                    <td>
                        ${selectEstado}
                    </td>
                </tr>
            `;
        });

    } catch (err) {
        console.error("Error:", err);
    }
}

async function actualizarEstado(id, nuevoEstado) {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`http://localhost:3000/conductores/estado/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ estado: nuevoEstado })
        });

        const data = await res.json();

        if (!res.ok) {
            alert("Error al actualizar estado: " + data.mensaje);
            return;
        }

        alert("Estado actualizado correctamente.");
        cargarConductores();

    } catch (error) {
        console.error("Error:", error);
    }
}
