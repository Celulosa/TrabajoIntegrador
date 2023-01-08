const { sequelize } = require('../database/models');
const db = require('../database/models');//Para importar sequelize
const Op = db.Sequelize.Op// para importar los Operadores de sequelize
const moment = require('moment')// para operar con fechas


module.exports = {

  product: async function (req, res) {
    let product = await db.productos.findByPk(req.params.id);
    return res.status(200).json(product);


  },

  checkout: async function (req, res) {
    //return res.send({ ...req.body, userId: req.session.userLogged.id });

    let ventas = await db.ventas.create({
      ...req.body, usuario_id: req.session.userLogged.id
    },
      {
        include: db.ventas.OrderItems,
      }
    );

    res.json({ ok: true, status: 200, ventas: ventas })


  },

  totalVentas: async function (req, res) {

    let ventas = await db.ventas.findAll({

      attributes: ['total'],
    
    })
    let totalVentas = 0
    let ventasArray = Object.values(ventas)
    ventasArray.forEach(element => totalVentas = totalVentas + element.total)
    
    res.json({ok: true, status:200, totalVentas :totalVentas})
  },
  ventasPorMes: async function (req, res) {
    let ventasPorMes = [];
    let month = 1
    while (month < 13) {

      let esteMes = await db.ventas.findAll({
        attributes: ['total'],
        where: {
          createdAt: {
            [Op.gte]: moment("0101", "MMDD").add(month - 1, 'months').toDate(),
            [Op.lt]: moment("0101", "MMDD").add(month, 'months').toDate(),
          }
        }
      })
      let esteMesArray = Object.values(esteMes) // convierte esteMes de un Object a un array
      //console.log('este mes',month,'longitud es',x.length)
      let totalPorMes = esteMesArray.reduce((acum, element) => (acum + element.total), 0);// en cada iteracion de mes suma los totales
      ventasPorMes.push(totalPorMes);
      month++;

    }
    res.json({ok: true, status:200, ventasPorMes :ventasPorMes})
  },

  totalOrdenes: async function (req, res) {

    let ordenes = await db.ventas.findAll({

      attributes: ['id'],

    })
    let totalOrdenes = ordenes.length
    res.json({ok: true, status:200, totalOrdenes :totalOrdenes})
  },

  ordenesPorMes: async function (req, res) {
    //return res.send({ ...req.body, userId: req.session.userLogged.id });
    let ordenesPorMes = []
    let month = 1
    while (month < 13) {

      let esteMes = await db.ventas.findAndCountAll({
        attributes: ['id'],
        where: {
          createdAt: {
            [Op.gte]: moment("0101", "MMDD").add(month - 1, 'months').toDate(),
            [Op.lt]: moment("0101", "MMDD").add(month, 'months').toDate(),
          }
        }
      })
      ordenesPorMes.push(esteMes);
      month++;
    }

    res.json({ok: true, status:200, ordenesPorMes : ordenesPorMes})

  },
  totalUsuarios: async function (req, res) {

    let usuarios = await db.users.findAll({

      attributes: ['id'],

    })
    let totalUsuarios = usuarios.length
    res.json(totalUsuarios)
  },

  usuariosPorMes: async function (req, res) {

    let usuariosPorMes = []
    let month = 1
    while (month < 13) {

      let esteMes = await db.users.findAll({
        attributes: ['id'],
        where: {
          createdAt: {
            [Op.gte]: moment("0101", "MMDD").add(month - 1, 'months').toDate(),
            [Op.lt]: moment("0101", "MMDD").add(month, 'months').toDate(),
          }
        }
      })
      let esteMesArray = Object.values(esteMes) // convierte esteMes de un Object a un array
      let totalPorMes = esteMesArray.length // cuenta el numero de objetos en el array que es igual al numero de usuarios

      usuariosPorMes.push(totalPorMes);
      month++;
    }

    res.json({ok: true, status:200, usuariosPorMes : usuariosPorMes})

  },

  productoMasVendido: async function (req, res) {
    
    let productosVendidos = await db.detalle_ventas.findAll({

      attributes: ['producto_id','quantity','nombre'],
      order: ['producto_id']
    })
    //Inicio de Lineas de aqui para abajo son para saber cuantos tipos de productos se vendieron
    let ids = [];
    let productosVendidosArray= Object.values(productosVendidos)
     productosVendidosArray.forEach(element => ids.push(element.producto_id ))
    let productosId=[];//array que muestra los diferentes tipos de productos o los diferentes productosId que se vendieron
    ids.forEach((elemento)=> {
      if(!productosId.includes(elemento)){
        productosId.push(elemento)
      }
    })
    // Final de lineas para saber cuantos tipos de productos se Vendieron

    // Inicio lineas para hacer un array con la suma de las cantidades por cada producto
    let sumaCantidadesPorProducto = []
    
    for(i=0; i< productosId.length; i++ ){
      
      let cantidadVendida = 0
      for(j=0; j < productosVendidosArray.length; j++){
        if(productosId[i]== productosVendidosArray[j].producto_id){
          //console.log('i',i)
          //console.log('j',j)
          //console.log('productoID',productosId[i])
          //console.log('arrayproductos',productosVendidosArray[j].producto_id)
          
          cantidadVendida = (parseInt(productosVendidosArray[j].quantity))+ cantidadVendida

        }
      }
      sumaCantidadesPorProducto.push(cantidadVendida)
      
    }
// fin de Lineas para hacer un array con la suma de las cantidades de cada producto
    let maxVentas = Math.max(...sumaCantidadesPorProducto) // con esta linea encuentro cual fue la max cantidad vendida del producto
    
    let indexProductoMasVendido = sumaCantidadesPorProducto.indexOf(maxVentas)// con esta linea encuentro el indice del producto mas vendido

    let idProductoMasVendido = productosId[indexProductoMasVendido]// con esta linea encuentro el ID del producto mas vendido

    let productoMasVendido = await db.productos.findByPk(idProductoMasVendido)
    //let prueba = [{total: maxVentas}]
    //let prueba1 = ({...productoMasVendido,prueba})
 //console.log(cantidadVendida)
 //console.log('los suma por productos',sumaCantidadesPorProducto)
 //console.log('la max es', maxVentas)
 //console.log('los productos son',productosId)
 //console.log('index del producto mas vendido',indexProductoMasVendido  )
 //console.log('id del producto mas vendido',idProductoMasVendido  )
 //console.log('id del producto mas vendido',productoMasVendido  )
 //console.log('id del producto mas vendido',prueba1  )
   //let productoMasVendido = productosVendidos.forEach(producto => producto)
    res.json({ok: true, status:200, productoMasVendido: productoMasVendido} )
    },
    
    
 
  



};
