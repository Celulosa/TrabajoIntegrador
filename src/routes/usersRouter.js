// ************ Controller Require ************

const usersController = require('../controllers/usersController')

// ************ Require's ************
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const guestMiddleware = require('../middlewares/guestMiddleware');
const loggedMiddleware = require('../middlewares/loggedMiddleware');
//const multer = require('multer');
const uploadFile = require('../modules/validateImage');
// estas lineas son para traer el JSON
const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, '../data/usersDataBase.json');
const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
// aqui termino de traer el JSON


//***  Multer configuration  ****/

/*const configuracionImagen = multer.diskStorage({
    destination: function(req, file, cb) {       // request, archivo y callback que almacena archivo en destino
     cb(null, path.join(__dirname,'../../public/images/avatars'));    // Ruta donde almacenamos el archivo
    },
    filename: function(req, file, cb) {          // request, archivo y callback que almacena archivo en destino
     let imageName =  Date.now() + file.originalname ;   // milisegundos y extensión de archivo original
     cb(null, imageName);         
    }
});


const uploadFile = multer({ storage: configuracionImagen });*/

//***  Validations  ****/

let validaciones = [
 
    body('nombre').notEmpty().withMessage('Debes ingresar tu Nombre'),
    body('apellido').notEmpty().withMessage('Debes ingresar tu Apellido'),
    body('email').isEmail().withMessage('Ingrese un correo valido'),
    body('direccion').notEmpty().withMessage('Por favor ingresa tu dirección de envios'),
    body('contrasena').isLength({min: 6}).withMessage('Tu contraseña debe tener minimo 6 caracteres'),
]

/*** LOGIN AND LOGING CHECK ***/ 
router.get('/login',usersController.login);
router.post('/login',usersController.loginCheck);

/*** EDIT USERS ***/
router.get('/edit/:id',usersController.edit);
router.put('/edit/:id',validaciones,usersController.update);

/*** REGISTER NEW USERS ***/
router.get('/registro',loggedMiddleware, usersController.registro)
router.post('/registro',uploadFile.single('avatar'),validaciones,usersController.guardarusuario)
/*router.post('/registro',uploadFile.single('avatar'),(req,res,next) => {
    const file = req.file
    if(!file){
        const error = new Error('Por favor seleccione un archivo')
        return next(error)}},validaciones, usersController.guardarusuario)*/

/*** DELETING USERS ***/
router.delete('/delete/:id', usersController.destroy)

/*** PERFIL DEL USUARIO ***/
router.get('/perfilusuario/',guestMiddleware,usersController.perfil)

/*** LOGOUT ***/
router.get('/logout/',usersController.logout)

/*** CHECK LOGING ***/


module.exports = router;