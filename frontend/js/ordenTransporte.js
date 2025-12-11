document.getElementById("btnGenerarPDF").addEventListener("click", () => {
    const id = document.getElementById("idSolicitud").value;

    if (!id) {
        alert("Debe ingresar un ID de solicitud.");
        return;
    }

    window.location.href = `http://localhost:3000/orden/pdf/${id}`;
});
