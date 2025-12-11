const API_URL = "http://localhost:3000";

// ======================================================
// 🔐 LOGIN
// ======================================================
async function login() {
    const correo = document.getElementById("correo").value.trim();
    const contraseña = document.getElementById("password").value.trim();

    if (!correo || !contraseña) {
        alert("Debe completar todos los campos.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correo, contraseña })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.mensaje || "Correo o contraseña incorrectos.");
            return;
        }

        // Guardar datos
        localStorage.setItem("token", data.token);
        localStorage.setItem("rol", data.rol);
        localStorage.setItem("usuarioId", data.id);

        // Redireccionar por rol
        if (data.rol === "admin") {
            window.location.href = "/html/menu.html";
        } else {
            window.location.href = "/html/menu-usuario.html";
        }

    } catch (error) {
        console.error(error);
        alert("Error de conexión con el servidor.");
    }
}



// ======================================================
// 📝 REGISTRO DE USUARIO
// ======================================================
async function register() {
    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("email").value.trim();
    const contraseña = document.getElementById("password").value.trim();

    if (!nombre || !correo || !contraseña) {
        alert("Debe completar todos los campos.");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/auth/registro`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, correo, contraseña })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.mensaje || "No se pudo crear la cuenta.");
            return;
        }

        alert("Cuenta creada correctamente.");
        
        // 🔥 CORRECCIÓN: redirección correcta
        window.location.href = "/html/login.html";

    } catch (error) {
        console.error(error);
        alert("Error al conectar con el servidor.");
    }
}



// ======================================================
// 🔄 RECUPERAR CONTRASEÑA
// ======================================================
async function recuperar() {
    const correo = document.getElementById("correo").value.trim();

    if (!correo) {
        alert("Debe ingresar un correo.");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/auth/recuperar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correo })
        });

        const data = await res.json();

        alert(data.mensaje || "Código de recuperación enviado.");

    } catch (error) {
        console.error(error);
        alert("Error al solicitar recuperación.");
    }
}
