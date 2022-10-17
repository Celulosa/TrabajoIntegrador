const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller ={
    home: (req, res) => {
    products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    res.render('home', {ps: products});
    },
    carrito: (req, res) => {
    products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
        res.render('carrito', {ps: products});
    }
};

module.exports = controller;