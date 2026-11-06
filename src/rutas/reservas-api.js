const express = require("express");
const { validarReserva } = require("../middleware/reservas");
const {
  validarReemplazoReserva,
  validarActualizacionReserva,
} = require("../middleware/cambios-reservas");

function crearRouterReservasApi(controlador) {
  const router = express.Router();

  router.get("/", controlador.listarApi);
  router.post("/", validarReserva, controlador.crearApi);
  router.get("/:id", controlador.obtenerApi);
  router.put("/:id", validarReemplazoReserva, controlador.reemplazarApi);
  router.patch("/:id", validarActualizacionReserva, controlador.actualizarApi);
  router.delete("/:id", controlador.eliminarApi);

  return router;
}

module.exports = crearRouterReservasApi;
