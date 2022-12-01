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

/*** DELETING USERS ***/
router.delete('/delete/:id', usersController.destroy)

/*** PERFIL DEL USUARIO ***/
router.get('/perfilusuario',guestMiddleware,usersController.perfil)

/*** LOGOUT ***/
router.get('/logout',usersController.logout)

/*** CREAR GERENTE***/ 
router.get('/creargerente', usersController.registrogerente)
router.post('/creargerente',uploadFile.single('avatar'),validaciones,usersController.creargerente)

/*** LISTA GERENTES***/ 
router.get('/listadogerentes', usersController.listadogerentes)

/*** EDIT USERS ***/
router.get('/editgerente/:id',usersController.editgerente);
router.put('/editgerente/:id',validaciones,usersController.updategerente);
/*** DELETING GERENTES ***/
router.delete('/deletegerente/:id', usersController.destroygerente)



module.exports = router;