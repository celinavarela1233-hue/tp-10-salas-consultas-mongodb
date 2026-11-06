const dns = require("node:dns");
const mongoose = require("mongoose");
const { MONGODB_URI } = require("./entorno");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

function errorConfiguracion(mensaje) {
  const error = new Error(mensaje);
  error.name = "ErrorConfiguracion";
  return error;
}

async function conectarBaseDatos() {
  if (!MONGODB_URI.trim()) {
    throw errorConfiguracion("MONGODB_URI no está definida o está vacía.");
  }

  if (!MONGODB_URI.startsWith("mongodb+srv://")) {
    throw errorConfiguracion("MONGODB_URI debe empezar con mongodb+srv://");
  }

  await mongoose.connect(MONGODB_URI);
  console.log("Conexión a MongoDB Atlas establecida.");
}

async function desconectarBaseDatos() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log("Conexión a MongoDB cerrada.");
  }
}

function describirError(error) {
  const origen = error.cause ?? error;
  const partes = [`nombre=${error.name}`];

  if (origen.code) partes.push(`código=${origen.code}`);
  if (origen.codeName) partes.push(`codeName=${origen.codeName}`);
  if (origen.syscall) partes.push(`operación=${origen.syscall}`);
  if (error.name === "ErrorConfiguracion") partes.push(error.message);

  return partes.join(" | ");
}

module.exports = {
  conectarBaseDatos,
  desconectarBaseDatos,
  describirError,
};
