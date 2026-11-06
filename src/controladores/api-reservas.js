const servicioReservas = require("../servicios/reservas");

async function listar(req, res, next) {
  try {
    const reservas = await servicioReservas.obtenerTodas(req.query);
    res.json(reservas);
  } catch (error) {
    next(error);
  }
}

async function obtenerDetalle(req, res, next) {
  try {
    const reserva = await servicioReservas.obtenerPorId(req.params.id);
    res.json(reserva);
  } catch (error) {
    next(error);
  }
}

async function crear(req, res, next) {
  try {
    if (
      !req.body ||
      typeof req.body !== "object" ||
      Array.isArray(req.body) ||
      Object.keys(req.body).length === 0
    ) {
      const error = new Error(
        "El cuerpo de la solicitud no es un JSON válido.",
      );
      error.status = 400;
      return next(error);
    }

    const reserva = await servicioReservas.crear(req.body);
    const location = `${req.protocol}://${req.get("host")}/api/reservas/${reserva.id}`;

    res.status(201).location(location).json(reserva);
  } catch (error) {
    if (error.name === "ValidationError") {
      error.status = 400;
    }
    next(error);
  }
}

module.exports = {
  listar,
  obtenerDetalle,
  crear,
};
