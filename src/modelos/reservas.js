const mongoose = require("mongoose");

const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
const turnosPermitidos = ["Mañana", "Tarde", "Noche"];
const estadosPermitidos = ["pendiente", "confirmada"];

const reservaSchema = new mongoose.Schema(
  {
    estudiante: {
      type: String,
      required: [true, "El estudiante es obligatorio."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio."],
      trim: true,
      match: [/@/, "El email debe contener un carácter @."],
    },
    sala: {
      type: String,
      required: [true, "La sala es obligatoria."],
      enum: {
        values: salasPermitidas,
        message: "La sala no es válida.",
      },
    },
    fecha: {
      type: String,
      required: [true, "La fecha es obligatoria."],
      trim: true,
    },
    turno: {
      type: String,
      required: [true, "El turno es obligatorio."],
      enum: {
        values: turnosPermitidos,
        message: "El turno no es válido.",
      },
    },
    personas: {
      type: Number,
      required: [true, "La cantidad de personas es obligatoria."],
      min: [1, "El mínimo de personas es 1."],
      max: [6, "El máximo de personas es 6."],
      validate: {
        validator: Number.isInteger,
        message: "La cantidad de personas debe ser un número entero.",
      },
    },
    estado: {
      type: String,
      required: [true, "El estado es obligatorio."],
      enum: {
        values: estadosPermitidos,
        message: "El estado no es válido.",
      },
      default: "pendiente",
    },
  },
  {
    versionKey: false,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  },
);

const Reserva = mongoose.model("Reserva", reservaSchema, "reservas");

Reserva.salasPermitidas = salasPermitidas;
Reserva.turnosPermitidos = turnosPermitidos;
Reserva.estadosPermitidos = estadosPermitidos;

module.exports = Reserva;
