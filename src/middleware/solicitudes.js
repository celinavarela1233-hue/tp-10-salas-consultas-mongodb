let numerosDeReservas = 0;

function identificarSolicitud(req, res, next) {
  numerosDeReservas += 1;
  res.locals.solicitudId = `BIB-${String(numerosDeReservas).padStart(4, "0")}`;
  console.log(
    `IdentificarSolicitud : [${res.locals.solicitudId}] ${req.method} ${req.originalUrl}`,
  );
  next();
}

function medirDuracion(req, res, next) {
  const inicio = process.hrtime.bigint();

  res.on("finish", () => {
    const fin = process.hrtime.bigint();
    const milisegundos = Number(fin - inicio) / 1_000_000;

    console.log(
      `Duracion: [${res.locals.solicitudId}] ${req.method} ${req.originalUrl} ` +
        `${res.statusCode} ${milisegundos.toFixed(2)} ms`,
    );
  });
  next();
}

module.exports = {
  identificarSolicitud,
  medirDuracion,
};
