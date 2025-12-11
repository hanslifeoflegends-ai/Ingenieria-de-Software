import Conductor from "../models/conductor.model.js";
import Viaje from "../models/viaje.model.js";


// ===========================================================
// REGISTRAR CONDUCTOR
// ===========================================================
export const registrarConductor = async (req, res) => {
    try {
        let { nombre, rut, telefono, licencia } = req.body;

        nombre = nombre?.trim();
        rut = rut?.trim();
        telefono = telefono?.trim();
        licencia = licencia?.trim();

        if (!nombre || !rut || !telefono || !licencia) {
            return res.status(400).json({ mensaje: "Todos los campos son obligatorios." });
        }

        const existe = await Conductor.findOne({ where: { rut } });

        if (existe) {
            return res.status(400).json({ mensaje: "El conductor ya está registrado." });
        }

        const conductor = await Conductor.create({
            nombre,
            rut,
            telefono,
            licencia,
            estado: "disponible"
        });

        return res.status(201).json({
            mensaje: "Conductor registrado correctamente",
            conductor
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};



// ===========================================================
// LISTAR CONDUCTORES + INDICAR SI TIENE VIAJE ACTIVO
//  ❌ SIN ALIAS, SIN INCLUDE QUE CAUSA ERRORES
// ===========================================================
export const listarConductores = async (req, res) => {
    try {
        const conductores = await Conductor.findAll();
        const respuesta = [];

        for (const c of conductores) {
            const viajeActivo = await Viaje.findOne({
                where: {
                    conductorId: c.id,
                    estado: "en ruta"
                }
            });

            respuesta.push({
                id: c.id,
                nombre: c.nombre,
                rut: c.rut,
                licencia: c.licencia,
                telefono: c.telefono,
                estado: c.estado,
                tieneViajeActivo: Boolean(viajeActivo)
            });
        }

        return res.json(respuesta);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: "Error interno al obtener conductores" });
    }
};



// ===========================================================
// ACTUALIZAR ESTADO DEL CONDUCTOR
// ===========================================================
export const actualizarEstadoConductor = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const ESTADOS_VALIDOS = ["disponible", "descanso"];

        if (!ESTADOS_VALIDOS.includes(estado)) {
            return res.status(400).json({ mensaje: "Estado inválido." });
        }

        const conductor = await Conductor.findByPk(id);

        if (!conductor) {
            return res.status(404).json({ mensaje: "Conductor no encontrado" });
        }

        const viajeActivo = await Viaje.findOne({
            where: {
                conductorId: id,
                estado: "en ruta"
            }
        });

        if (viajeActivo) {
            return res.status(400).json({
                mensaje: "El conductor está en un viaje y no se puede cambiar su estado."
            });
        }

        conductor.estado = estado;
        await conductor.save();

        return res.json({
            mensaje: "Estado del conductor actualizado correctamente",
            conductor
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: "Error interno al actualizar el estado" });
    }
};



// ===========================================================
// ELIMINAR CONDUCTOR — NO SE ELIMINA SI TIENE VIAJE ACTIVO
// ===========================================================
export const eliminarConductor = async (req, res) => {
    try {
        const { id } = req.params;

        const conductor = await Conductor.findByPk(id);

        if (!conductor) {
            return res.status(404).json({ mensaje: "Conductor no encontrado." });
        }

        const viajeActivo = await Viaje.findOne({
            where: {
                conductorId: id,
                estado: "en ruta"
            }
        });

        if (viajeActivo) {
            return res.status(400).json({
                mensaje: "No se puede eliminar: el conductor tiene un viaje activo."
            });
        }

        await conductor.destroy();

        return res.json({ mensaje: "Conductor eliminado correctamente." });

    } catch (error) {
        console.error("Error al eliminar conductor:", error);
        return res.status(500).json({ mensaje: "Error interno al eliminar conductor." });
    }
};
