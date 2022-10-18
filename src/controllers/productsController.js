
const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/usersDataBase.json');
const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));



const controlador ={

    carrito: (req , res) => {
        res.render('carrito');
    },
    detalle: (req , res) => {
        res.render('products/detalleproducto')
    },
    crear: (req , res) => {
        res.render('products/crearproducto')
    },
    editar: (req , res) => {
        res.render('products/editarproducto')
    },

   
}

module.exports = controlador;

