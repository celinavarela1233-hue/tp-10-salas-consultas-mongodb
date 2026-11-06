function obtenerStatus(err) {
  if (err.status) return err.status;
  if (err.codigo === "ID_INVALIDO" || err.codigo === "ENTRADA_INVALIDA") {
    return 400;
  }
  if (err.name === "ValidationError" || err.name === "CastError") return 400;
  return 500;
}

function crearManejadorErrores(vistaError, tituloError) {
  return function (err, req, res, next) {
    console.error("Error capturado:", err);

    if (res.headersSent) return next(err);

    const status = obtenerStatus(err);
    const mensaje = status === 500 ? "Error interno del servidor" : err.message;

    if (req.originalUrl.startsWith("/api/")) {
      return res.status(status).json({
        error: mensaje,
        codigo:
          err.codigo || (status === 400 ? "ENTRADA_INVALIDA" : "ERROR_INTERNO"),
      });
    }

    res.status(status).render(vistaError || "no-encontrado", {
      titulo: tituloError || "Error",
      error: mensaje,
    });
  };
}

module.exports = { crearManejadorErrores };
