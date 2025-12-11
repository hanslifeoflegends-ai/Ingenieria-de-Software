async function enviarSolicitud() {

    const token = localStorage.getItem("token");
    const usuarioId = localStorage.getItem("usuarioId");

    if (!token || !usuarioId) {
        alert("Debe iniciar sesión nuevamente.");
        localStorage.clear();
        window.location.href = "login.html";
        return;
    }

    // Obtener valores del formulario
    const tipo_servicio = document.getElementById("tipoCarga").value;
    const origen = document.getElementById("origen").value.trim();
    const destino = document.getElementById("destino").value.trim();
    const fecha = document.getElementById("fecha").value;

    // 🔥 Eliminada la validación de descripción
    if (!tipo_servicio || !origen || !destino || !fecha) {
        alert("Debe completar todos los campos obligatorios.");
        return;
    }

    // 🔥 Ya NO se incluye descripción
    const datos = {
        tipo_servicio,
        origen,
        destino,
        fecha
    };

    try {
        const respuesta = await fetch("http://localhost:3000/solicitudes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(datos)
        });

        const result = await respuesta.json();

        if (!respuesta.ok) {
            alert("Error al registrar solicitud: " + (result.mensaje || "Error desconocido"));
            return;
        }

        alert("Solicitud registrada correctamente.");
        window.location.href = "menu-usuario.html";

    } catch (error) {
        console.error(error);
        alert("Error al conectar con el servidor.");
    }
}
