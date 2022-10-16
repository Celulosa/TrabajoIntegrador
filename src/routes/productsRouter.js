const productsController = require('../controllers/productsController')


const express = require('express');
const router = express.Router();





router.get('/carrito', productsController.carrito)
router.get('/detalleproducto', productsController.detalle)
router.get('/crearproducto', productsController.crear)
router.get('/editarproducto', productsController.editar)

module.exports = router;

