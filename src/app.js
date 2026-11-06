const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");

const servicioReservas = require("./servicios/reservas");
const crearControladorReservas = require("./controladores/reservas");
const crearRouterReservasHtml = require("./rutas/reservas");
const crearRouterReservasApi = require("./rutas/reservas-api");
const { crearManejadorErrores } = require("./middleware/errores");
const Reserva = require("./modelos/reservas");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(expressLayouts);
app.set("layout", "layouts/main");

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/estado", async (req, res, next) => {
  try {
    const totalReservas = await Reserva.countDocuments({});
    res.json({ estado: "activo", totalReservas });
  } catch (error) {
    next(error);
  }
});

const controlador = crearControladorReservas(servicioReservas);

app.use("/api/reservas", crearRouterReservasApi(controlador));

app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "Recurso de API no encontrado" });
});

app.use("/", crearRouterReservasHtml(controlador));

app.use(crearManejadorErrores("reservas/nueva", "Nueva Reserva"));

module.exports = app;
