// Cargar clientes activos al iniciar
document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const clienteSelect = document.getElementById("cliente");

    try {
        const res = await fetch("/clientes", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await res.json();

        clienteSelect.innerHTML = `<option value="">Seleccione un cliente...</option>`;

        data.forEach(c => {
            if (c.estado === "Activo") {
                clienteSelect.innerHTML += `<option value="${c.id}">${c.nombre}</option>`;
            }
        });

    } catch (error) {
        document.getElementById("mensaje").innerText = "Error cargando clientes.";
    }
});


// Guardar solicitud
document.getElementById("btnGuardar").addEventListener("click", async () => {
    const clienteId = document.getElementById("cliente").value;
    const tipoCarga = document.getElementById("tipoCarga").value;
    const origen = document.getElementById("origen").value.trim();
    const destino = document.getElementById("destino").value.trim();
    const fecha = document.getElementById("fecha").value;
    const detalle = document.getElementById("detalle").value.trim();

    const mensaje = document.getElementById("mensaje");
    mensaje.innerText = "";

    if (!clienteId || !tipoCarga || !origen || !destino || !fecha) {
        mensaje.innerText = "Todos los campos obligatorios deben estar completos.";
        mensaje.style.color = "red";
        return;
    }

    const token = localStorage.getItem("token");

    try {
        const res = await fetch("/solicitudes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                clienteId,
                tipoCarga,
                origen,
                destino,
                fecha,
                detalle
            })
        });

        const data = await res.json();
        mensaje.innerText = data.message;

        if (res.ok) {
            mensaje.style.color = "green";

            document.getElementById("origen").value = "";
            document.getElementById("destino").value = "";
            document.getElementById("fecha").value = "";
            document.getElementById("detalle").value = "";
            document.getElementById("tipoCarga").value = "";
            document.getElementById("cliente").value = "";
        } else {
            mensaje.style.color = "red";
        }

    } catch (error) {
        mensaje.innerText = "Error de conexión con el servidor.";
        mensaje.style.color = "red";
    }
});
