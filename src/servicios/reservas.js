const Reserva = require("../modelos/reservas");

async function listar(query = {}) {
  const reservas = await Reserva.find(query).lean();
  return reservas.map((doc) => ({
    id: doc._id.toString(),
    estudiante: doc.estudiante,
    email: doc.email,
    sala: doc.sala,
    fecha: doc.fecha,
    turno: doc.turno,
    personas: doc.personas,
    estado: doc.estado,
  }));
}

async function obtenerPorId(id) {
  const doc = await Reserva.findById(id).lean();
  if (!doc) return null;
  return {
    id: doc._id.toString(),
    estudiante: doc.estudiante,
    email: doc.email,
    sala: doc.sala,
    fecha: doc.fecha,
    turno: doc.turno,
    personas: doc.personas,
    estado: doc.estado,
  };
}

async function crear(datos) {
  const doc = await Reserva.create(datos);
  return {
    id: doc._id.toString(),
    estudiante: doc.estudiante,
    email: doc.email,
    sala: doc.sala,
    fecha: doc.fecha,
    turno: doc.turno,
    personas: doc.personas,
    estado: doc.estado,
  };
}

async function eliminar(id) {
  const resultado = await Reserva.deleteOne({ _id: id });
  return resultado.deletedCount === 1;
}

async function reemplazar(id, datos) {
  const doc = await Reserva.findOneAndReplace({ _id: id }, datos, {
    runValidators: true,
    returnDocument: "after",
    upsert: false,
  });
  if (!doc) return null;
  return {
    id: doc._id.toString(),
    estudiante: doc.estudiante,
    email: doc.email,
    sala: doc.sala,
    fecha: doc.fecha,
    turno: doc.turno,
    personas: doc.personas,
    estado: doc.estado,
  };
}

async function actualizar(id, datos) {
  const doc = await Reserva.findOneAndUpdate(
    { _id: id },
    { $set: datos },
    { runValidators: true, returnDocument: "after", upsert: false },
  );
  if (!doc) return null;
  return {
    id: doc._id.toString(),
    estudiante: doc.estudiante,
    email: doc.email,
    sala: doc.sala,
    fecha: doc.fecha,
    turno: doc.turno,
    personas: doc.personas,
    estado: doc.estado,
  };
}

async function consultar({
  sala,
  orden = "estudiante",
  pagina = 1,
  limite = 2,
}) {
  const filtro = {};
  if (sala !== undefined) {
    filtro.sala = sala.trim();
  }

  let ordenMongo = { estudiante: 1, _id: 1 };
  if (orden === "personas-asc") {
    ordenMongo = { personas: 1, _id: 1 };
  } else if (orden === "personas-desc") {
    ordenMongo = { personas: -1, _id: 1 };
  }

  const skip = (pagina - 1) * limite;

  const [documentos, total] = await Promise.all([
    Reserva.find(filtro)
      .select("estudiante email sala fecha turno personas estado")
      .sort(ordenMongo)
      .skip(skip)
      .limit(limite)
      .lean(),
    Reserva.countDocuments(filtro),
  ]);

  const datos = documentos.map((doc) => ({
    id: doc._id.toString(),
    estudiante: doc.estudiante,
    email: doc.email,
    sala: doc.sala,
    fecha: doc.fecha,
    turno: doc.turno,
    personas: doc.personas,
    estado: doc.estado,
  }));

  const paginas = total === 0 ? 0 : Math.ceil(total / limite);

  return {
    datos,
    pagina,
    limite,
    total,
    paginas,
  };
}

module.exports = {
  listar,
  obtenerPorId,
  crear,
  eliminar,
  reemplazar,
  actualizar,
  consultar,
  obtenerTodas: listar,
};
