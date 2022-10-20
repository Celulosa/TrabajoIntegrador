const express = require('express');
const router = express.Router();
const multer = require('multer');

const productsController = require('../controllers/productsController')

const configuracionImagen = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname,'../../public/images'));
    },
    filename: function(req, file, cb) {
        let imageName = Date.now() + file.originalname ;
        cb(null, imageName);
    }
});

const uploadFile = multer({ storage: configuracionImagen});

router.get('/', productsController.home); 
router.get('/carrito', productsController.carrito);
router.get('/crearproducto', productsController.crear);
router.post('/crearproducto', productsController.store); 
router.get('/detalleproducto/:id', productsController.detalle); 
router.get('/editarproducto/:id', productsController.editar); 
router.put('/editarproducto/:id', uploadFile.single('imageProductEdit'), productsController.update); 
router.delete('/delete/:id', productsController.destroy); 
router.post("/create", uploadFile.single('imageProduct'), productsController.store);

module.exports = router;

