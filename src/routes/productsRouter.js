const express = require('express');
const router = express.Router();

const productsController = require('../controllers/productsController')


router.get('/', productsController.home); 
router.get('/carrito', productsController.carrito);
router.get('/crearproducto', productsController.crear);
router.post('/crearproducto', productsController.store); 
router.get('/detalleproducto/:id', productsController.detalle); 
router.get('/editarproducto/:id', productsController.editar); 
router.put('/editarproducto/:id', productsController.update); 
router.delete('/delete/:id', productsController.destroy); 

module.exports = router;
