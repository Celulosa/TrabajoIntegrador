const mainController = require('../controllers/userController')

const express = require('express');
const router = express.Router();

router.get('/login',productsController.login);
router.get('/registro', productsController.registro)



module.exports = router;