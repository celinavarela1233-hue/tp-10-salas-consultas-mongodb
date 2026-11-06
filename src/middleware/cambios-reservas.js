const {
  salasPermitidas,
  turnosPermitidos,
  estadosPermitidos,
} = require("../modelos/reservas");

function validarReemplazoReserva(req, res, next) {
  const datos = req.body;

  if (
    !datos ||
    typeof datos !== "object" ||
    Array.isArray(datos) ||
    Object.keys(datos).length === 0
  ) {
    return res.status(400).json({
      error: "El cuerpo de la solicitud debe ser un objeto JSON válido.",
    });
  }

  const permitidos = [
    "estudiante",
    "email",
    "sala",
    "fecha",
    "turno",
    "personas",
    "estado",
  ];

  for (const campo of Object.keys(datos)) {
    if (
      !permitidos.includes(campo) ||
      campo === "_id" ||
      campo.startsWith("$")
    ) {
      return res.status(400).json({
        error: `El campo ${campo} no está permitido en el reemplazo.`,
      });
    }
  }

  const { estudiante, email, sala, fecha, turno, personas, estado } = datos;

  if (
    estudiante === undefined ||
    email === undefined ||
    sala === undefined ||
    fecha === undefined ||
    turno === undefined ||
    personas === undefined ||
    estado === undefined
  ) {
    return res.status(400).json({
      error:
        "El reemplazo total (PUT) exige los 7 campos obligatorios sin omisiones.",
    });
  }

  if (
    typeof estudiante !== "string" ||
    !estudiante.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    !email.includes("@")
  ) {
    return res
      .status(400)
      .json({ error: "Datos de estudiante o email inválidos." });
  }

  if (!salasPermitidas.includes(sala)) {
    return res
      .status(400)
      .json({ error: "La sala especificada no es válida." });
  }

  if (typeof fecha !== "string" || !fecha.trim()) {
    return res
      .status(400)
      .json({ error: "La fecha es obligatoria y debe ser un texto válido." });
  }

  if (!turnosPermitidos.includes(turno)) {
    return res
      .status(400)
      .json({ error: "El turno especificado no es válido." });
  }

  if (
    typeof personas === "boolean" ||
    Array.isArray(personas) ||
    typeof personas === "object" ||
    personas === null
  ) {
    return res
      .status(400)
      .json({ error: "El formato del campo personas es inválido." });
  }
  const numPersonas = Number(personas);
  if (!Number.isInteger(numPersonas) || numPersonas < 1 || numPersonas > 6) {
    return res
      .status(400)
      .json({ error: "Personas debe ser un número entero entre 1 y 6." });
  }

  if (!estadosPermitidos.includes(estado)) {
    return res
      .status(400)
      .json({ error: "El estado especificado no es válido." });
  }

  req.cambiosValidos = {
    estudiante: estudiante.trim(),
    email: email.trim(),
    sala,
    fecha: fecha.trim(),
    turno,
    personas: numPersonas,
    estado,
  };

  next();
}

function validarActualizacionReserva(req, res, next) {
  const datos = req.body;
  if (
    !datos ||
    typeof datos !== "object" ||
    Array.isArray(datos) ||
    Object.keys(datos).length === 0
  ) {
    return res.status(400).json({
      error: "Enviá un objeto JSON válido para la actualización parcial.",
    });
  }

  for (const campo of Object.keys(datos)) {
    if (campo !== "personas" && campo !== "estado") {
      return res.status(400).json({
        error: `El campo ${campo} no se puede modificar mediante PATCH.`,
      });
    }
  }

  if (datos.personas === undefined && datos.estado === undefined) {
    return res.status(400).json({
      error: "Se debe enviar al menos el campo 'personas' o 'estado'.",
    });
  }

  const cambios = {};

  if (datos.personas !== undefined) {
    if (
      typeof datos.personas === "boolean" ||
      Array.isArray(datos.personas) ||
      typeof datos.personas === "object" ||
      datos.personas === null
    ) {
      return res
        .status(400)
        .json({ error: "El formato del campo personas es inválido." });
    }
    const numPersonas = Number(datos.personas);
    if (!Number.isInteger(numPersonas) || numPersonas < 1 || numPersonas > 6) {
      return res
        .status(400)
        .json({ error: "Personas debe ser un número entero entre 1 y 6." });
    }
    cambios.personas = numPersonas;
  }

  if (datos.estado !== undefined) {
    if (!estadosPermitidos.includes(datos.estado)) {
      return res
        .status(400)
        .json({ error: "El estado debe ser pendiente o confirmada." });
    }
    cambios.estado = datos.estado;
  }

  req.cambiosValidos = cambios;
  next();
}

module.exports = {
  validarReemplazoReserva,
  validarActualizacionReserva,
};
