import Tarifa from "../models/tarifa.model.js";

export const calcularCosto = async (req, res) => {
  try {
    const { tipoCarga, distancia } = req.body;

    // Validaciones
    if (!tipoCarga) {
      return res.status(400).json({ message: "Debe indicar el tipo de carga." });
    }

    if (!distancia || distancia <= 0 || isNaN(distancia)) {
      return res.status(400).json({ message: "La distancia debe ser un número válido mayor que 0." });
    }

    // Buscar tarifa correspondiente
    const tarifa = await Tarifa.findOne({ where: { tipoCarga } });

    if (!tarifa) {
      return res.status(400).json({
        message: "No existe tarifa registrada para este tipo de carga."
      });
    }

    // Cálculo
    const precioBase = tarifa.precioBase;
    const precioPorKm = tarifa.precioPorKm;
    const total = precioBase + (precioPorKm * distancia);

    return res.json({
      tipoCarga,
      distancia,
      precioBase,
      precioPorKm,
      total
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error al calcular el costo." });
  }
};
