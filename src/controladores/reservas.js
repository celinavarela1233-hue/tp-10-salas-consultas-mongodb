function crearControladorReservas(servicioReservas) {
  async function listarHtml(req, res, next) {
    try {
      const reservas = await servicioReservas.listar();
      res.render("reservas/lista", { reservas, titulo: "Lista de Reservas" });
    } catch (error) {
      next(error);
    }
  }

  async function verDetalleHtml(req, res, next) {
    try {
      const reserva = await servicioReservas.obtenerPorId(req.params.id);
      if (!reserva) {
        return res
          .status(404)
          .render("no-encontrado", { titulo: "Reserva No Encontrada" });
      }
      res.render("reservas/detalle", { reserva, titulo: "Detalle de Reserva" });
    } catch (error) {
      next(error);
    }
  }

  function formularioNueva(req, res) {
    res.render("reservas/nueva", {
      titulo: "Nueva Reserva",
      error: null,
      valores: {},
    });
  }

  async function crearHtml(req, res, next) {
    try {
      await servicioReservas.crear(req.body);
      res.redirect("/reservas");
    } catch (error) {
      if (error.name === "ValidationError") {
        const mensajes = Object.values(error.errors).map((e) => e.message);
        return res.status(400).render("reservas/nueva", {
          titulo: "Nueva Reserva",
          error: mensajes.join(". "),
          valores: req.body || {},
        });
      }
      next(error);
    }
  }

  async function listarApi(req, res, next) {
    try {
      const permitidos = ["sala", "orden", "pagina", "limite"];
      const queryKeys = Object.keys(req.query);

      for (const campo of queryKeys) {
        if (!permitidos.includes(campo)) {
          return res.status(400).json({ error: "Parámetro no permitido." });
        }
      }

      let sala = undefined;
      if (queryKeys.includes("sala")) {
        const valSala = req.query.sala;
        if (
          Array.isArray(valSala) ||
          typeof valSala !== "string" ||
          valSala.trim() === ""
        ) {
          return res
            .status(400)
            .json({ error: "El parámetro sala debe ser un texto válido." });
        }
        sala = valSala;
      }

      let orden = "estudiante";
      if (queryKeys.includes("orden")) {
        const valOrden = req.query.orden;
        if (
          Array.isArray(valOrden) ||
          !["estudiante", "personas-asc", "personas-desc"].includes(valOrden)
        ) {
          return res.status(400).json({ error: "Orden no permitido." });
        }
        orden = valOrden;
      }

      let pagina = 1;
      if (queryKeys.includes("pagina")) {
        const valPagina = req.query.pagina;
        if (Array.isArray(valPagina)) {
          return res.status(400).json({ error: "Parámetro pagina duplicado." });
        }
        const numPag = Number(valPagina);
        if (!Number.isInteger(numPag) || numPag < 1 || numPag > 1000) {
          return res.status(400).json({ error: "Página inválida." });
        }
        pagina = numPag;
      }

      let limite = 2;
      if (queryKeys.includes("limite")) {
        const valLim = req.query.limite;
        if (Array.isArray(valLim)) {
          return res.status(400).json({ error: "Parámetro limite duplicado." });
        }
        const numLim = Number(valLim);
        if (!Number.isInteger(numLim) || numLim < 1 || numLim > 20) {
          return res.status(400).json({ error: "Límite inválido." });
        }
        limite = numLim;
      }

      const resultado = await servicioReservas.consultar({
        sala,
        orden,
        pagina,
        limite,
      });
      res.json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async function obtenerApi(req, res, next) {
    try {
      const reserva = await servicioReservas.obtenerPorId(req.params.id);
      if (!reserva) {
        return res.status(404).json({ error: "Recurso no encontrado." });
      }
      res.json(reserva);
    } catch (error) {
      next(error);
    }
  }

  async function crearApi(req, res, next) {
    try {
      const reserva = await servicioReservas.crear(req.body);
      res.status(201).location(`/api/reservas/${reserva.id}`).json(reserva);
    } catch (error) {
      next(error);
    }
  }

  async function eliminarApi(req, res, next) {
    try {
      const eliminado = await servicioReservas.eliminar(req.params.id);
      if (!eliminado) {
        return res.status(404).json({ error: "Recurso no encontrado." });
      }
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }

  async function reemplazarApi(req, res, next) {
    try {
      const reserva = await servicioReservas.reemplazar(
        req.params.id,
        req.body,
      );
      if (!reserva) {
        return res.status(404).json({ error: "Recurso no encontrado." });
      }
      res.json(reserva);
    } catch (error) {
      next(error);
    }
  }

  async function actualizarApi(req, res, next) {
    try {
      const reserva = await servicioReservas.actualizar(
        req.params.id,
        req.body,
      );
      if (!reserva) {
        return res.status(404).json({ error: "Recurso no encontrado." });
      }
      res.json(reserva);
    } catch (error) {
      next(error);
    }
  }

  return {
    listarHtml,
    verDetalleHtml,
    formularioNueva,
    crearHtml,
    listarApi,
    obtenerApi,
    crearApi,
    eliminarApi,
    reemplazarApi,
    actualizarApi,
  };
}

module.exports = crearControladorReservas;
