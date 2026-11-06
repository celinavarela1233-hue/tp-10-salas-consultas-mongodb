const {
  conectarBaseDatos,
  desconectarBaseDatos,
  describirError,
} = require("../src/config/base-datos");

async function comprobar() {
  try {
    await conectarBaseDatos();
    console.log("Prueba de conexión exitosa.");
  } catch (error) {
    console.error("Falló la comprobación de conexión:", describirError(error));
    process.exitCode = 1;
  } finally {
    await desconectarBaseDatos();
  }
}

comprobar();
