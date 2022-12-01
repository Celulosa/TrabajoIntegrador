const fs = require('fs');
const path = require('path');

//const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
//let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
let productsdb = [];

const db = require('../database/models');//Para importar sequelize
const Op = db.Sequelize.Op;//para usar los operadores de sequelize
const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	home: (req, res) => {
		db.productos.findAll({ include: [{ association: 'categorias' }] })
			.then((productos) => {
				for (producto of productos) {
					let objaux = {
						nombre: producto.nombre,
						categorias: producto.categorias.nombre,
						precio: producto.precio
					}

					productsdb.push(objaux);
				}
				//console.log("ver: ", listaPeliculas);
				/*if (!req.session.userLogged){
					res.render('homegeneral',{ps: productsdb});
				console.log('usuariotipo session en main controller', req.session.usuarioTipo)
				}*/
				if(req.session.usuarioTipo == 'super'){
					res.render('homesuperadmin',{ps: productsdb});
				}
				else if(req.session.usuarioTipo == 'admin'){
					res.render('homeadmin',{ps: productsdb});
				} else{
					res.render('homegeneral',{ps: productsdb});
				}

			});
		

	},
	carrito: (req, res) => {
		products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
		res.render('carrito', { ps: products });
	}
};

module.exports = controller;