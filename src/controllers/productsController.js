const { validationResult } = require('express-validator');// importa los resultados de las validaciones
const { privateDecrypt } = require('crypto');
const fs = require('fs');
const path = require('path');
//const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
//let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));


const db = require('../database/models');//Para importar sequelize
const Op = db.Sequelize.Op;//para usar los operadores de sequelize

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {

	listado: (req, res) => {
		let productsdb = [];
		db.productos.findAll({ include: [{ association: 'categorias' }, { association: 'talles' }, { association: 'temporadas' }, { association: 'colores' }] })
			.then((productos) => {
				for (producto of productos) {
					let objaux = {
						id: producto.id,
						nombre: producto.nombre,
						categorias: producto.categorias.nombre,
						precio: producto.precio,
						imagen: producto.imagen
					}

					productsdb.push(objaux);
				}
				if(req.session.usuarioTipo == 'general'){
					return res.render('products/listadoproductos', { productos: productsdb })
				  }
				  if(req.session.usuarioTipo == 'admin'){
					return res.render('products/listadoproductosgerente', { productos: productsdb })
				  }
				  if(req.session.usuarioTipo == 'super'){
					return res.render('products/listadoproductossuper', { productos: productsdb })
				  }
				
			});
	},
	carrito: (req, res) => {
		res.render('carrito');
	},
	detalle: (req, res) => {
		db.productos.findByPk(req.params.id, { include: [{ association: 'categorias' }, { association: 'talles' }, { association: 'temporadas' }, { association: 'colores' }] })
			.then(function (producto) {
				res.render('products/detalleproducto', { producto: producto });
			});
	},
	crear: (req, res) => {
		if (req.session.usuarioTipo == 'admin') {
			db.categorias.findAll()
				.then((categorias) => {
					let resultado = [];
					for (let categoria of categorias) {
						let objaux = {
							id: categoria.id,
							nombre: categoria.nombre,
						}
						resultado.push(objaux);
					}
					res.render('products/crearproducto', { categorias: resultado });
				});
		}
	},
	store: (req, res) => {
		let nombreImagen = req.file.filename;
		db.productos.create(
			{
				nombre: req.body.name,
				precio: req.body.price,
				descripcion: req.body.description,
				imagen: nombreImagen,
				categoria_id: req.body.category,
			}
		)
			.then((resultados) => {
				res.redirect('/products/listadoproductos');
			});
	},
	editar: function (req, res) {
		db.productos.findByPk(req.params.id, { include: [{ association: 'categorias' }, { association: 'talles' }, { association: 'temporadas' }, { association: 'colores' }] })
			.then(function (producto) {
				res.render('products/editarproducto', { producto: producto });
			})
	},
	update: function (req, res) {
		let nombreImagen = req.file.filename;
		db.productos.update({
			id: req.body.id,
			nombre: req.body.name,
			precio: req.body.price,
			categoria: req.body.category,
			descripcion: req.body.description,
			imagen: nombreImagen
		},
			{
				where: {
					id: req.params.id
				}
			})
		res.redirect('/products/detalleproducto/' + req.params.id)
		//res.render('products/detalleproducto',{producto: producto})	
	},
	destroy: function (req, res) {
		db.productos.destroy({
			where: {
				id: req.params.id
			}
		})
		res.redirect('/products/listadoproductos');
		//fs.writeFileSync(productsFilePath, JSON.stringify(products,null, ' '));
		//fs.unlinkSync(path.join(__dirname,'../../public/images/'+nombreImagen));
		//res.render('products/listadoproductos',{productos: products});
	}
}
module.exports = controller;

