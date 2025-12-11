const API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btnGuardarConductor");
    btn.addEventListener("click", registrarConductor);
});

async function registrarConductor() {

    const nombre = document.getElementById("nombre").value.trim();
    const rut = document.getElementById("rut").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const licencia = document.getElementById("licencia").value.trim();
    const msg = document.getElementById("mensaje");

    msg.textContent = "";

    // VALIDACIONES FRONTEND
    if (!nombre || !rut || !telefono || !licencia) {
        msg.textContent = "Todos los campos son obligatorios.";
        msg.style.color = "red";
        return;
    }

    if (!/^\+569\d{8}$/.test(telefono)) {
        msg.textContent = "El teléfono debe tener formato +569xxxxxxxx.";
        msg.style.color = "red";
        return;
    }

    // 📌 OBTENER TOKEN DEL LOGIN
    const token = localStorage.getItem("token");

    if (!token) {
        msg.textContent = "No tienes sesión activa. Inicia sesión nuevamente.";
        msg.style.color = "red";
        return;
    }

    try {
        const res = await fetch(`${API_URL}/conductores`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // <-- 🔥 TOKEN AQUÍ
            },
            body: JSON.stringify({
                nombre,
                rut,
                telefono,
                licencia,
                estado: "disponible"
            })
        });

        const data = await res.json();

        if (!res.ok) {
            msg.textContent = data.mensaje || "Error al registrar conductor.";
            msg.style.color = "red";
            return;
        }

        msg.textContent = "Conductor registrado correctamente.";
        msg.style.color = "green";

        document.getElementById("nombre").value = "";
        document.getElementById("rut").value = "";
        document.getElementById("telefono").value = "";
        document.getElementById("licencia").value = "";

    } catch (error) {
        console.error(error);
        msg.textContent = "Error de comunicación con el servidor.";
        msg.style.color = "red";
    }
}
