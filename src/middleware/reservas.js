const Reserva = require("../modelos/reservas");

function validarReserva(req, res, next) {
  const datos = req.body;
  if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
    return res
      .status(400)
      .json({ error: "El cuerpo de la solicitud debe ser un objeto válido." });
  }

  const { estudiante, email, sala, fecha, turno, personas } = datos;

  if (
    !estudiante ||
    !email ||
    !sala ||
    !fecha ||
    !turno ||
    personas === undefined
  ) {
    return res
      .status(400)
      .json({ error: "Faltan campos obligatorios en la reserva." });
  }

  if (!Reserva.salasPermitidas.includes(sala)) {
    return res.status(400).json({ error: "Sala no permitida." });
  }

  if (!Reserva.turnosPermitidos.includes(turno)) {
    return res.status(400).json({ error: "Turno no permitido." });
  }

  next();
}

module.exports = {
  validarReserva,
};
