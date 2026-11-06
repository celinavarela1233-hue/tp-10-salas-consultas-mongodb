const {
  conectarBaseDatos,
  desconectarBaseDatos,
  describirError,
} = require("../src/config/base-datos");
const Reserva = require("../src/modelos/reserva");

async function listar() {
  try {
    await conectarBaseDatos();

    const reservas = await Reserva.find();

    reservas.forEach((r) => {
      console.log(
        `- ${r._id.toString()} | ${r.estudiante} | ${r.sala} | ${r.fecha} | ${r.turno} | ${r.personas} pers.`,
      );
    });
    console.log(`Cantidad de reservas recuperadas: ${reservas.length}`);
  } catch (error) {
    console.error("Error al consultar reservas:", describirError(error));
    process.exitCode = 1;
  } finally {
    await desconectarBaseDatos();
  }
}

listar();
