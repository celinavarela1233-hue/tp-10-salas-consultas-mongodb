const app = require("./app");
const { PORT } = require("./config/entorno");
const {
  conectarBaseDatos,
  desconectarBaseDatos,
} = require("./config/base-datos");
const describirError = (err) => err.message || "Error desconocido";

async function iniciarServidor() {
  try {
    await conectarBaseDatos();
    const servidor = app.listen(PORT, () => {
      console.log(`Servidor HTTP listo en el puerto ${PORT}`);
    });

    const cerrarServidor = async (senal) => {
      console.log(
        `\nRecibida señal ${senal}. Cerrando servidor HTTP y MongoDB...`,
      );
      servidor.close(async () => {
        await desconectarBaseDatos();
        console.log("Servidor y base de datos cerrados correctamente.");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => cerrarServidor("SIGINT"));
    process.on("SIGTERM", () => cerrarServidor("SIGTERM"));
  } catch (error) {
    console.error("Fallo al iniciar la aplicación:", describirError(error));
    process.exit(1);
  }
}

iniciarServidor();
