document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formRegistrarCamion");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const token = localStorage.getItem("token");

        const patente = document.getElementById("patente").value.trim();
        const capacidad = document.getElementById("capacidad").value.trim();
        const marca = document.getElementById("marca").value.trim();
        const modelo = document.getElementById("modelo").value.trim();
        const año = document.getElementById("anio").value.trim();

        if (!patente || !capacidad) {
            alert("Debe completar patente y capacidad.");
            return;
        }

        try {
            const res = await fetch("/camiones", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({ patente, capacidad, marca, modelo, año })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.mensaje || "Error al registrar camión");
                return;
            }

            alert("✔ Camión registrado correctamente");
            window.location.href = "administracion.html";

        } catch (error) {
            console.error(error);
            alert("Error al conectar con el servidor.");
        }
    });
});
