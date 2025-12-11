import Cliente from "../models/cliente.model.js";

// ===============================
// Registrar Cliente
// ===============================
export const registrarCliente = async (req, res) => {
  try {
    const { nombre, correo, telefono, direccion } = req.body;

    if (!nombre || !correo || !telefono || !direccion) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios." });
    }

    // Validar correo único
    const existe = await Cliente.findOne({ where: { correo } });

    if (existe) {
      return res.status(400).json({ mensaje: "El correo ya está registrado." });
    }

    const cliente = await Cliente.create({
      nombre,
      correo,
      telefono,
      direccion
    });

    res.json({
      mensaje: "Cliente registrado correctamente",
      cliente
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===============================
// Listar clientes
// ===============================
export const listarClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
