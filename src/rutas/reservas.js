const express = require("express");
const { validarReserva } = require("../middleware/reservas");
const mongoose = require("mongoose");

function crearRouterReservasHtml(controlador) {
  const router = express.Router();

  router.get("/", (req, res) => res.render("inicio", { titulo: "Inicio" }));

  router.get("/estado", async (req, res) => {
    try {
      await mongoose.connection.db.admin().ping();
      res.json({ estado: "ok", baseDatos: "conectada" });
    } catch {
      res.status(503).json({ estado: "error", baseDatos: "desconectada" });
    }
  });

  router.get("/reservas", controlador.listarHtml);
  router.get("/reservas/nueva", controlador.formularioNueva);
  router.post("/reservas", validarReserva, controlador.crearHtml);
  router.get("/reservas/:id", controlador.verDetalleHtml);

  return router;
}

module.exports = crearRouterReservasHtml;
