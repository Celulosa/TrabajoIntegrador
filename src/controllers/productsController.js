const fs = require('fs');
const path = require('path');
const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller ={

    home: (req, res) => {
		products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
		res.render('products',{ps: products});
	},
	carrito: (req , res) => {
        res.render('carrito');
    },
    detalle: (req , res) => {
    	let idProducto = req.params.id;
		let objProducto;
		for (let o of products){
			if (idProducto == o.id){
				objProducto=o;
				break;
			}
		}
		res.render('products/detalleproducto',{producto: objProducto})
	},
     crear: (req , res) => {
        res.render('products/crearproducto');
     },
	 store: (req, res) => {

		/*console.log(req.file);*/

		let nombreImagen = req.file.filename;

		let productoNuevo = {
			id: (products[products.length-1].id)+1,
			name: req.body.name,
			price: req.body.price,
			category: req.body.category,
			description: req.body.description,
			image: nombreImagen,
		}

		products.push(productoNuevo);

		fs.writeFileSync(productsFilePath,JSON.stringify(products,null," "));

		res.redirect('/');
	},
     editar: (req , res) => {
    	let idProducto = req.params.id;
		let objProducto;
		for (let o of products){
			if (idProducto == o.id){
				objProducto=o;
				break;
			}
		}
		res.render('products/editarproducto',{producto: objProducto})
     },
	 update: (req, res) => {
		let idProducto = req.params.id;

		let nombreImagen = req.file.filename;

		for (let o of products){
			if (idProducto == o.id){
				o.name = req.body.name;
				o.price = req.body.price;
				o.category = req.body.category;
				o.description = req.body.description;
				o.image = nombreImagen;
				break;
			}
		}
		
		
		fs.writeFileSync(productsFilePath,JSON.stringify(products,null," "));
		res.redirect('products/detalleproducto/:id');
	},
	destroy : (req, res) => {
		
		let idProducto = req.params.id;

		let arrProductos = products.filter(function(elemento){
			return elemento.id!=idProducto;
		})

		for (let arrProductos of products){
			if (products.id == id){
				arrProductos=products
			}
		}
		fs.unlinkSync(path.join(__dirname, '../../public/images/', arrProductos.image));

		fs.writeFileSync(productsFilePath,JSON.stringify(arrProductos,null," "));

		res.redirect('/');
	}
 };
 
 module.exports = controller;

