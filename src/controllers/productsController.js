const { validationResult } = require('express-validator');// importa los resultados de las validaciones
const { privateDecrypt } = require('crypto');
const fs = require('fs');
const path = require('path');
//const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
//let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));


const db = require('../database/models');//Para importar sequelize
const Op = db.Sequelize.Op;//para usar los operadores de sequelize

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");//Se usa para poner una coma cada 3 decimales

const controller = {
	//PARA LISTAR TODOS LOS PRODUCTOS DE LA BASE DE DATOS
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
				if (req.session.usuarioTipo == 'general') {
					return res.render('products/listadoproductos', {toThousand, productos: productsdb })
				}
				if (req.session.usuarioTipo == 'admin') {
					return res.render('products/listadoproductosgerente', { toThousand,productos: productsdb })
				}
				if (req.session.usuarioTipo == 'super') {
					return res.render('products/listadoproductossuper', { toThousand,productos: productsdb })
				}
				else {
					return res.render('products/listadoproductos', { toThousand,productos: productsdb })
				}
			});


	},
	//carrito de productos escogidos
	/*shoppingCart: async function (req,res){
		return res.render('products/cart');
	},*/
	shoppingCart: async function (req, res) {
		try {
			let products = await db.productos.findAll({ include: [{ association: 'categorias' }, { association: 'talles' }, { association: 'temporadas' }, { association: 'colores' }] });
			return res.render('./products/cart', { products: products })
		} catch (error) {
			console.log(error);
			return res.render('./products/error');
		}
	},
	pedido: async function (req, res) {
		let ventas = await db.ventas.findByPk(req.params.id, {

		});

		let detalle = await db.detalle_ventas.findAll({
			where: {
				ventaId: req.params.id
			}
		})
		if (ventas.usuario_id == req.session.userLogged.id) {
			return res.render('./products/pedido', { ventas: ventas, toThousand, detalle: detalle });
		} else {
			return res.send('No tienes permiso para ver este Pedido')
		}
	},
	//BUSQUEDA POR DATO EN BARRA
	search: async function (req, res) {
		try {
			let productos = await db.productos.findAll({ include: [{ association: 'categorias' }, { association: 'talles' }, { association: 'temporadas' }, { association: 'colores' }] });
			let searchResults = productos.filter(productos => productos.nombre.toLowerCase().includes(req.query.keywords.toLowerCase()));
			let productFound = searchResults.length;
			
			//console.log ('lo que busco', req.query)
			(searchResults.length == 0) ? searchResults = productos : "null"
			
			return res.render("./products/search", {searchResults, productFound, keywords: req.query.keywords })
		} catch (error) {
			console.log(error);
			return res.render("./products/error");
		}
	},
	/*search: async function(req,res){
		let productos = await db.productos.findAll({ include: [{ association: 'categorias' }, { association: 'talles' }, { association: 'temporadas' }, { association: 'colores' }] });
			let searchResults = (productos.filter(productos => productos.nombre.toLowerCase().includes(req.query.keywords.toLowerCase())));
			let resultado = searchResults.length
			let ensayo = Object.values(productos)
			let encontrados = []
			searchResults.forEach(element => encontrados.push(element.id))
			console.log ('busqueda', encontrados)
			//console.log ('busqueda', resultado)

	},*/
	detalle: (req, res) => {
		db.productos.findByPk(req.params.id)
			.then(function (producto) {
				res.render('products/detalleproducto', { producto: producto });
			});
	},
	crear: async (req, res) => {
		if (req.session.usuarioTipo == 'admin') {
			let categorias = await db.categorias.findAll();
			let talles = await db.talles.findAll();
			let colores = await db.colores.findAll();
			let temporadas = await db.temporadas.findAll();
			let users = await db.users.findAll();
			res.render('products/crearproducto', { categorias: categorias, talles: talles, colores: colores, temporadas: temporadas, users: users });
		}
	},
	store: (req, res) => {
		let nombreImagen = req.file.filename;
		db.productos.create(
			{
				nombre: req.body.name,
				precio: req.body.price,
				descripcion: req.body.description,
				talle_id: req.body.talles,
				color_id: req.body.colores,
				temporada_id: req.body.temporadas,
				imagen: nombreImagen,
				admin_id: req.session.userLogged.id,
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
	},
	error: (req, res) => {
		return res.render("./products/error")
	},
}
module.exports = controller;

