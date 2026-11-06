const {
  conectarBaseDatos,
  desconectarBaseDatos,
  describirError,
} = require("../src/config/base-datos");
const Reserva = require("../src/modelos/reserva");

const datosReserva = {
  estudiante: "Celina Varela",
  email: "celina@ejemplo.com",
  sala: "Sala Norte",
  fecha: "2026-10-25",
  turno: "Tarde",
  personas: 3,
};

async function crear() {
  try {
    await conectarBaseDatos();

    const guardada = await Reserva.create(datosReserva);

    console.log("Reserva guardada con éxito.");
    console.log("ID confirmado:", guardada._id.toString());
  } catch (error) {
    if (error.name === "ValidationError") {
      console.error("Reserva rechazada por validación.");
      console.error("Campos a revisar:", Object.keys(error.errors).join(", "));
      for (const [campo, detalle] of Object.entries(error.errors)) {
        console.error(`- ${campo}: ${detalle.message}`);
      }
    } else {
      console.error("Error al crear la reserva:", describirError(error));
    }
    process.exitCode = 1;
  } finally {
    await desconectarBaseDatos();
  }
}

crear();
