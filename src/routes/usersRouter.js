// ************ Controller Require ************

const usersController = require('../controllers/usersController')

// ************ Require's ************
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

//***  Validations  ****/

let validaciones = [
 
    body('email').isEmail().withMessage('Ingrese un correo valido'),
   
]


/*** LOGIN AND LOGING CHECK ***/ 
router.get('/login',usersController.login);
router.post('/login',usersController.check);

/*** EDIT USERS ***/
router.get('/edit/:id',usersController.edit);
router.put('/edit/:id',validaciones,usersController.update);

/*** REGISTER NEW USERS ***/
router.get('/registro', usersController.registro)
router.post('/registro',validaciones, usersController.guardarusuario)

/*** DELETING USERS ***/
router.delete('/delete/:id', usersController.destroy)


module.exports = router;