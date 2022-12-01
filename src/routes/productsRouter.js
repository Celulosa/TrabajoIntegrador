const express = require('express');
const router = express.Router();
/* const { body } = require('express-validator');*/
const multer = require('multer');
const path = require('path')
const uploadFile = require('../modules/validateImage');

const productsController = require('../controllers/productsController')
/* diskStorage Multer*/
const configuracionImagen = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,'../../public/images'));
    },
    filename: function(req, file, cb) {
        let imageName = Date.now() + path.extname(file.originalname);
        cb(null, imageName);
    }
});

/*let validaciones = [
 
    body('name').notEmpty().withMessage('Debes ingresar nombre del producto'),
    body('price').notEmpty().withMessage('Debes ingresar precio'),
    body('description').notEmpty().withMessage('Debes ingresar Descripción'),
    body('categoria').notEmpty().withMessage('Debes ingresar categoria'),
    body('Talla').notEmpty().withMessage('Debes ingresar talla'),
    body('colores').notEmpty().withMessage('Debes ingresar color'),
    body('Temporadas').notEmpty().withMessage('Debes ingresar temporada'),
]*/

router.get('/', productsController.listado); 
router.get('/carrito', productsController.carrito);
router.get('/crearproducto', productsController.crear);
router.post('/crearproducto',uploadFile.single('imageProduct'), productsController.store); 
router.get('/detalleproducto/:id', productsController.detalle); 
router.get('/editarproducto/:id', productsController.editar);
router.put('/editarproducto/:id',uploadFile.single('imageProductEdit'),  productsController.update);
router.delete('/delete/:id', productsController.destroy); 
router.get('/listadoproductos', productsController.listado); 

module.exports = router;

