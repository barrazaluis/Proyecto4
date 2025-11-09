const { reservas } = require('../data/store');
const { v4: uuidv4 } = require('uuid');

// Crear reserva
function crearReserva(req, res) {
  const {
    hotel,
    tipo_habitacion,
    num_huespedes,
    fecha_llegada,
    fecha_salida,
    estado,
    cliente,
  } = req.body;

  // Validación de campos obligatorios
  if (
    !hotel ||
    !tipo_habitacion ||
    !num_huespedes ||
    !fecha_llegada ||
    !fecha_salida ||
    !cliente
  ) {
    return res
      .status(400)
      .json({ error: 'Faltan campos obligatorios en la solicitud' });
  }

  const nuevaReserva = {
    id: uuidv4(),
    hotel,
    tipo_habitacion,
    num_huespedes,
    fecha_llegada, // formato ISO recomendado
    fecha_salida,
    estado: estado || 'pendiente',
    cliente,
    creado_en: new Date().toISOString(),
  };

  reservas.push(nuevaReserva);
  res.status(201).json(nuevaReserva);
}

// Obtener lista de reservas con filtros
function listarReservas(req, res) {
  let results = reservas.slice();
  const {
    hotel,
    fecha_inicio,
    fecha_fin,
    tipo_habitacion,
    estado,
    num_huespedes,
  } = req.query;

  // Filtros
  if (hotel) {
    results = results.filter(
      (r) => r.hotel.toLowerCase() === hotel.toLowerCase()
    );
  }

  if (tipo_habitacion) {
    results = results.filter(
      (r) => r.tipo_habitacion.toLowerCase() === tipo_habitacion.toLowerCase()
    );
  }

  if (estado) {
    results = results.filter(
      (r) => r.estado.toLowerCase() === estado.toLowerCase()
    );
  }

  if (num_huespedes) {
    const n = parseInt(num_huespedes, 10);
    if (!Number.isNaN(n)) {
      results = results.filter(
        (r) =>
          Number(r.num_huespedes) === n || Number(r.num_huespedes) >= n
      );
    }
  }

  if (fecha_inicio || fecha_fin) {
    const inicio = fecha_inicio ? new Date(fecha_inicio) : null;
    const fin = fecha_fin ? new Date(fecha_fin) : null;

    results = results.filter((r) => {
      const llegada = new Date(r.fecha_llegada);
      const salida = new Date(r.fecha_salida);

      // Comprobamos intersección de rango
      if (inicio && fin) return salida >= inicio && llegada <= fin;
      if (inicio) return salida >= inicio;
      if (fin) return llegada <= fin;
      return true;
    });
  }

  res.json(results);
}

// Obtener reserva por id
function obtenerReserva(req, res) {
  const { id } = req.params;
  const reserva = reservas.find((r) => r.id === id);
  if (!reserva)
    return res.status(404).json({ error: 'Reserva no encontrada' });
  res.json(reserva);
}

// Actualizar reserva
function actualizarReserva(req, res) {
  const { id } = req.params;
  const index = reservas.findIndex((r) => r.id === id);
  if (index === -1)
    return res.status(404).json({ error: 'Reserva no encontrada' });

  reservas[index] = {
    ...reservas[index],
    ...req.body,
    actualizado_en: new Date().toISOString(),
  };

  res.json(reservas[index]);
}

// Eliminar reserva
function eliminarReserva(req, res) {
  const { id } = req.params;
  const index = reservas.findIndex((r) => r.id === id);
  if (index === -1)
    return res.status(404).json({ error: 'Reserva no encontrada' });

  reservas.splice(index, 1);
  res.status(204).send();
}

module.exports = {
  crearReserva,
  listarReservas,
  obtenerReserva,
  actualizarReserva,
  eliminarReserva,
};
