const express = require('express');
const router = express.Router();
const {
  crearReserva,
  listarReservas,
  obtenerReserva,
  actualizarReserva,
  eliminarReserva,
} = require('../controllers/reservasController');

// CRUD principal
router.post('/', crearReserva);
router.get('/', listarReservas);
router.get('/:id', obtenerReserva);
router.put('/:id', actualizarReserva);
router.delete('/:id', eliminarReserva);

module.exports = router;
