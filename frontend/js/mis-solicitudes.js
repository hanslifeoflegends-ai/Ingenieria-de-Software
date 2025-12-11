document.addEventListener("DOMContentLoaded", cargarMisSolicitudes);

async function cargarMisSolicitudes() {

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Debe iniciar sesión nuevamente.");
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/solicitudes/mis-solicitudes", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();

        const tbody = document.querySelector("#tablaSolicitudes tbody");
        tbody.innerHTML = "";

        if (!res.ok) {
            tbody.innerHTML = `<tr><td colspan="6">Error: ${data.mensaje}</td></tr>`;
            return;
        }

        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6">No tiene solicitudes registradas.</td></tr>`;
            return;
        }

        data.forEach(s => {
            tbody.innerHTML += `
                <tr>
                    <td>${s.id}</td>
                    <td>${s.tipo_servicio}</td>
                    <td>${s.fecha}</td>
                    <td>${s.origen}</td>
                    <td>${s.destino}</td>
                    <td>${s.estado}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.error(error);
        alert("Error al cargar solicitudes.");
    }
}
