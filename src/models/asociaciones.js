import Cliente from "./cliente.model.js";
import Solicitud from "./solicitud.model.js";
import Viaje from "./viaje.model.js";
import Camion from "./camion.model.js";
import Conductor from "./conductor.model.js";
import Usuario from "./usuario.model.js";

/* CLIENTE → SOLICITUD */
Cliente.hasMany(Solicitud, {
  as: "solicitudesCliente",
  foreignKey: "clienteId",
});
Solicitud.belongsTo(Cliente, {
  as: "cliente",
  foreignKey: "clienteId",
});

/* USUARIO → SOLICITUD */
Usuario.hasMany(Solicitud, {
  as: "solicitudesUsuario",
  foreignKey: "usuarioId",
});
Solicitud.belongsTo(Usuario, {
  as: "usuario",
  foreignKey: "usuarioId",
});

/* SOLICITUD → VIAJE */
Solicitud.hasOne(Viaje, {
  as: "viajeAsignado",
  foreignKey: "solicitudId",
});
Viaje.belongsTo(Solicitud, {
  as: "solicitudViaje",
  foreignKey: "solicitudId",
});

/* CAMION → VIAJE */
Camion.hasMany(Viaje, {
  as: "viajesDelCamion",
  foreignKey: "camionId",
});
Viaje.belongsTo(Camion, {
  as: "camion",
  foreignKey: "camionId",
});

/* CONDUCTOR → VIAJE */
Conductor.hasMany(Viaje, {
  as: "viajesDelConductor",
  foreignKey: "conductorId",
});
Viaje.belongsTo(Conductor, {
  as: "conductor",
  foreignKey: "conductorId",
});

export {
  Cliente,
  Solicitud,
  Viaje,
  Camion,
  Conductor,
  Usuario
};
