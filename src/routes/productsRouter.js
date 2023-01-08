const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productsController = require('../controllers/productsController')
const guestMiddleware = require('../middlewares/guestMiddleware');
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

const uploadFile = multer({ storage: configuracionImagen});

router.get('/', productsController.listado); 
router.get("/cart",guestMiddleware, productsController.shoppingCart);
router.get("/pedido/:id",guestMiddleware, productsController.pedido);
router.get('/crearproducto', productsController.crear);
router.post('/crearproducto',uploadFile.single('imageProduct'), productsController.store); 
router.get('/detalleproducto/:id', productsController.detalle); 
router.get('/editarproducto/:id', productsController.editar);
router.put('/editarproducto/:id',uploadFile.single('imageProductEdit'),  productsController.update);
router.delete('/delete/:id', productsController.destroy); 
router.get('/listadoproductos', productsController.listado); 
router.get("/search", productsController.search);

module.exports = router;

