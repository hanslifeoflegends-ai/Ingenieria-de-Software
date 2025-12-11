document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("btnRegister");

    if (!btn) {
        console.error("No se encontró el botón btnRegister");
        return;
    }

    btn.addEventListener("click", async () => {

        const nombre = document.getElementById("nombre")?.value.trim();
        const correo = document.getElementById("correo")?.value.trim();
        const contraseña = document.getElementById("contraseña")?.value.trim();

        if (!nombre || !correo || !contraseña) {
            alert("Completa todos los campos.");
            return;
        }

        try {
            const response = await fetch("/auth/registro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre,
                    correo,
                    contraseña
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.mensaje || "Error al registrar usuario.");
                return;
            }

            alert("Cuenta creada con éxito.");
            window.location.href = "/login";

        } catch (error) {
            console.error(error);
            alert("Error de conexión con el servidor.");
        }

    });

});
