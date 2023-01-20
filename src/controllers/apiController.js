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

    res.json({ ok: true, status: 200, totalVentas: totalVentas })
  },
  ventasPorDia: async function (req, res) {

    let ventas = await db.ventas.findAll({

      attributes: ['total', 'createdAt'],
      group: 'createdAt',
      order: [["createdAt"]]
    })
    //***Inicio código para encontrar que dia del año es hoy (va de 1 a 365 o 366)
    function dayOfYear(fecha) {
      let now = new Date(fecha);
      let start = new Date(now.getFullYear(), 0, 0);
      let diff = now - start;
      let oneDay = 1000 * 60 * 60 * 24;
      let day = Math.floor(diff / oneDay);
      return day
    }
    //console.log('Day of year: ' + dayOfYear(ventas[2].createdAt));
    //***Fin código para encontrar que dia del año es hoy (va de 1 a 365 o 366)

    //***Inicio código para hacer el calentario del presente año desde 1ro enero hasta el dia de hoy
    let year = new Date().getFullYear()
    var startDate = new Date(year, 0, 1); //YYYY-MM-DD // el primero de enero del presente año
    var endDate = new Date(); //YYYY-MM-DD // el dia de hoy
    console.log(year)
    var getDateArray = function (start, end) {
      var arr = new Array();
      var dt = new Date(start);
      while (dt <= end) {
        arr.push(new Date(dt));
        dt.setDate(dt.getDate() + 1);
      }
      return arr;
    }
    
    var calendario = getDateArray(startDate, endDate)
    //Inicio lineas para pasar las fecha de formato ISO a año-mes-dia YYYY-MM-DD
    let calendarioFormateado = []
    for (let i= 0; i<calendario.length; i++){
      calendarioFormateado.push(calendario[i].getFullYear()+"-"+(calendario[i].getMonth()+1)+"-"+calendario[i].getDate())
    }
    //Fin lineas para pasar las fecha de formato ISO a año-mes-dia YYYY-MM-DD
    
    //***Fin código para hacer el calentario del presente año desde 1ro enero hasta el dia de hoy


    //*** Inicio código para crear un nuevo array de ventas llamado newVentas en el cual se agregan los dias que faltan en el array de ventas original
    // cuando en un dia no hay ventas, la base de datos no contiene la fecha de ese dia.
    let hoy = dayOfYear(new Date())
    let newVentas = []

    //inicio código para completar el array newVentas en caso de que desde el primer dia del año hasta el primer dia de ventas exista algún dia inexistente
    let primerDiaConVentas = dayOfYear(ventas[0].createdAt)
    let missingStart = primerDiaConVentas - 1//reviso si desde el primer dia del año hasta el primer dia de ventas hay algun dia sin ventas, osea que no se haya registrado
    // agrego al array newVentas los dias faltantes desde la última venta hasta hoy
    if (missingStart > 0) {
      for (let i = 1; i <= missingStart; i++) {
        newVentas.push({ total: 0, dia: i })
      }
    }
    //Fin código para completar el array newVentas en caso de que desde el primer dia del año hasta el primer dia de ventas exista algún dia inexistente

    for (let i = 0; i < ventas.length; i++) {
      if (i == 0) {
        var faltanDias = 0
      } else {
        faltanDias = dayOfYear(ventas[i].createdAt) - dayOfYear(ventas[i - 1].createdAt)//cuando no se registran ventas en un dia, no se agrega el createdAt a ese dia y con esta funcion busco los dias que no hay ventas
      }
      if (faltanDias < 2) {
        newVentas.push({ total: ventas[i].total, dia: dayOfYear(ventas[i].createdAt) })
      } else {
        newVentas.push({ total: 0, dayOfYear: dayOfYear(ventas[i - 1].createdAt) + 1 })//agrego a newVentas el dia que falta
        newVentas.push({ total: ventas[i].total, dia: dayOfYear(ventas[i].createdAt) })
      }

    }
    //inicio código para completar el array newVentas en caso de que desde la fecha de la ultima venta hasta hoy existan dias
    let ultimoDiaConVentas = dayOfYear(ventas[ventas.length - 1].createdAt) // reviso cual fué el último dia con ventas en el array original de ventas
    let missingEnd = hoy - ultimoDiaConVentas //reviso si desde el dia de la ultima venta hasta hoy han habido ventas
    // agrego al array newVentas los dias faltantes desde la última venta hasta hoy
    if (missingEnd > 0) {
      for (let i = 1; i <= missingEnd; i++) {
        newVentas.push({ total: 0, dia: ultimoDiaConVentas + i })
      }
    }
    //Fín código para completar el array newVentas en caso de que desde la fecha de la ultima venta hasta hoy existan dias

    //*** Fín código para crear un nuevo array de ventas llamado newVentas en el cual se agregan los dias que faltan en el array de ventas original



    //***Inicio código para hacer un array con el total de las ventas diarias y le agrego la fecha de cada dia

    let totalVentasPorDia = []

    for (let dia = 1; dia <= hoy; dia++) {
      let total = 0
      for (let i = 0; i < newVentas.length; i++) {
        if (dia == newVentas[i].dia) {
          total = newVentas[i].total + total
        }

      }
      totalVentasPorDia.push({ dia: calendarioFormateado[dia - 1], total: total })
    }

    console.log(totalVentasPorDia)
    
    

    res.json({ ok: true, status: 200, ventasPorDia: totalVentasPorDia })
  },
  ventasPorMes: async function (req, res) {
    let ventasPorMes = [];
    var meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
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
      ventasPorMes.push({mes: meses[month-1], totalPorMes: totalPorMes});
      month++;

    }

    res.json({ ok: true, status: 200, ventasPorMes: ventasPorMes })
  },

  totalOrdenes: async function (req, res) {

    let ordenes = await db.ventas.findAll({

      attributes: ['id'],

    })
    let totalOrdenes = ordenes.length
    res.json({ ok: true, status: 200, totalOrdenes: totalOrdenes })
  },

  ordenesPorMes: async function (req, res) {
    //return res.send({ ...req.body, userId: req.session.userLogged.id });
    
    var meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
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
      ordenesPorMes.push({mes: meses[month-1], total: esteMes.count, ordenes: esteMes.rows});
      month++;
      console.log (esteMes)
    }
    

    res.json({ ok: true, status: 200, ordenesPorMes: ordenesPorMes })

  },
  totalUsuarios: async function (req, res) {

    let usuarios = await db.users.findAll({

      attributes: ['id'],

    })
    let totalUsuarios = usuarios.length
    res.json(totalUsuarios)
  },

  usuariosPorMes: async function (req, res) {
    var meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
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

      usuariosPorMes.push({mes: meses[month-1], usuarios:totalPorMes});
      month++;
    }

    res.json({ ok: true, status: 200, usuariosPorMes: usuariosPorMes })

  },

  productoMasVendido: async function (req, res) {

    let productosVendidos = await db.detalle_ventas.findAll({

      attributes: ['producto_id', 'quantity', 'nombre'],
      order: ['producto_id']
    })
    //Inicio de codigo de aqui para abajo son para saber cuantos tipos de productos se vendieron
    let ids = [];//aqui estan todos los productos ID del array productos Vendidos, es decir, hay id repetidos
    let productosVendidosArray = Object.values(productosVendidos)
    productosVendidosArray.forEach(element => ids.push(element.producto_id))
    let productosId = [];//array que muestra los diferentes tipos de productos o los diferentes productosId que se vendieron, sin repetir los productos Id
    ids.forEach((elemento) => {
      if (!productosId.includes(elemento)) {
        productosId.push(elemento)
      }
    })
    // Final de codigo para saber cuantos tipos de productos se Vendieron

    // Inicio codigo para hacer un array de los productos vendidos con sus cantidades vendidas
    let arrayProdutosIdconCantidades = []
    for (i = 0; i < productosId.length; i++) {

      let cantidadVendida = 0
      for (j = 0; j < productosVendidosArray.length; j++) {
        if (productosId[i] == productosVendidosArray[j].producto_id) {
          cantidadVendida = (parseInt(productosVendidosArray[j].quantity)) + cantidadVendida//suma las cantidades vendidas de cada productoId vendido
        }
      }
      arrayProdutosIdconCantidades.push({ producto_id: productosId[i], totalcantidad: cantidadVendida })


    }
    // fin de codigo para hacer un array de los productos vendidos con sus cantidades vendidas



    /*let maxVentas = Math.max(...sumaCantidadesPorProducto) // con esta linea encuentro cual fue la max cantidad vendida del producto
        
        let indexProductoMasVendido = sumaCantidadesPorProducto.indexOf(maxVentas)// con esta linea encuentro el indice del producto mas vendido
    
        let idProductoMasVendido = productosId[indexProductoMasVendido]// con esta linea encuentro el ID del producto mas vendido
    */

    //Inicio código para hacer un array de los productos vendidos con las cantidades que se vendieron por producto y el revenue por producto
    let productos = await db.productos.findAll()
    let productoMasVendido = []
    for (let i = 0; i < arrayProdutosIdconCantidades.length; i++) {
      if (productos.id == arrayProdutosIdconCantidades.producto_id) {
        productoMasVendido.push({
          id: productos[i].id,
          nombre: productos[i].nombre,
          precio: productos[i].precio,
          descripcion: productos[i].descripcion,
          fecha_creacion: productos[i].fecha_creacion,
          imagen: productos[i].imagen,
          admin_id: productos[i].admin_id,
          categoria_id: productos[i].categoria_id,
          talle_id: productos[i].talle_id,
          color_id: productos[i].color_id,
          temporada_id: productos[i].temporada_id,
          cantidadVendida: arrayProdutosIdconCantidades[i].totalcantidad,
          ventasProducto: arrayProdutosIdconCantidades[i].totalcantidad * productos[i].precio
        });
      }
    }
    //Fin código para hacer un array de los productos vendidos con las cantidades que se vendieron por producto y el revenue por producto


    // Inicio de codigo para organizar arrayProdutosIdconCantidades por cantidades de venta de menor a Mayor
    productoMasVendido.sort((p1, p2) => {
      if (p1.cantidadVendida < p2.cantidadVendida) return 1;
      if (p1.cantidadVendida > p2.cantidadVendida) return -1;
      return 0
    })
    // Fin de codigo para organizar arrayProdutosIdconCantidades por cantidades de venta de menor a Mayor

    //console.log('productosID', productosId)
    // console.log('suma cantidades',sumaCantidadesPorProducto)
    //console.log('array', arrayProdutosIdconCantidades)
    //console.log('organizado', organizado)
    //console.log('productos', productos)
    res.json({ ok: true, status: 200, productoMasVendido: productoMasVendido })
  },

  productoMasVendidoPorMes: async function (req, res) {
    let productoMasVendidoPorMes = []
    let month = 1
    while (month < 13) {
      let productosVendidos = await db.detalle_ventas.findAll({

        attributes: ['producto_id', 'quantity', 'nombre'],
        order: ['producto_id'],
        where: {
          createdAt: {
            [Op.gte]: moment("0101", "MMDD").add(month - 1, 'months').toDate(),
            [Op.lt]: moment("0101", "MMDD").add(month, 'months').toDate(),
          }
        }

      })
      //Inicio de codigo de aqui para abajo son para saber cuantos tipos de productos se vendieron
      let ids = [];//aqui estan todos los productos ID del array productos Vendidos, es decir, hay id repetidos
      let productosVendidosArray = Object.values(productosVendidos)
      productosVendidosArray.forEach(element => ids.push(element.producto_id))
      let productosId = [];//array que muestra los diferentes tipos de productos o los diferentes productosId que se vendieron, sin repetir los productos Id
      ids.forEach((elemento) => {
        if (!productosId.includes(elemento)) {
          productosId.push(elemento)
        }
      })
      // Final de codigo para saber cuantos tipos de productos se Vendieron

      // Inicio codigo para hacer un array de los productos vendidos con sus cantidades vendidas
      let arrayProdutosIdconCantidades = []
      for (i = 0; i < productosId.length; i++) {

        let cantidadVendida = 0
        for (j = 0; j < productosVendidosArray.length; j++) {
          if (productosId[i] == productosVendidosArray[j].producto_id) {
            cantidadVendida = (parseInt(productosVendidosArray[j].quantity)) + cantidadVendida//suma las cantidades vendidas de cada productoId vendido
          }
        }
        arrayProdutosIdconCantidades.push({ producto_id: productosId[i], totalcantidad: cantidadVendida })


      }
      // fin de codigo para hacer un array de los productos vendidos con sus cantidades vendidas



      /*let maxVentas = Math.max(...sumaCantidadesPorProducto) // con esta linea encuentro cual fue la max cantidad vendida del producto
          
          let indexProductoMasVendido = sumaCantidadesPorProducto.indexOf(maxVentas)// con esta linea encuentro el indice del producto mas vendido
      
          let idProductoMasVendido = productosId[indexProductoMasVendido]// con esta linea encuentro el ID del producto mas vendido
      */

      //Inicio código para hacer un array de los productos vendidos con las cantidades que se vendieron por producto y el revenue por producto
      let productos = await db.productos.findAll()
      let productoMasVendido = []
      for (let i = 0; i < arrayProdutosIdconCantidades.length; i++) {
        if (productos.id == arrayProdutosIdconCantidades.producto_id) {
          productoMasVendido.push({
            id: productos[i].id,
            nombre: productos[i].nombre,
            precio: productos[i].precio,
            descripcion: productos[i].descripcion,
            fecha_creacion: productos[i].fecha_creacion,
            imagen: productos[i].imagen,
            admin_id: productos[i].admin_id,
            categoria_id: productos[i].categoria_id,
            talle_id: productos[i].talle_id,
            color_id: productos[i].color_id,
            temporada_id: productos[i].temporada_id,
            cantidadVendida: arrayProdutosIdconCantidades[i].totalcantidad,
            ventasProducto: arrayProdutosIdconCantidades[i].totalcantidad * productos[i].precio
          });
        }
      }
      //Fin código para hacer un array de los productos vendidos con las cantidades que se vendieron por producto y el revenue por producto


      // Inicio de codigo para organizar arrayProdutosIdconCantidades por cantidades de venta de menor a Mayor
      productoMasVendido.sort((p1, p2) => {
        if (p1.cantidadVendida < p2.cantidadVendida) return 1;
        if (p1.cantidadVendida > p2.cantidadVendida) return -1;
        return 0
      })
      // Fin de codigo para organizar arrayProdutosIdconCantidades por cantidades de venta de menor a Mayor

      productoMasVendidoPorMes.push(productoMasVendido)
      month++
    }

    res.json({ ok: true, status: 200, productoMasVendidoPorMes: productoMasVendidoPorMes })
  },

  totalProductos: async function (req, res) {

    let productos = await db.productos.findAll()

    let totalProductos = productos.length

    console.log ('variedad', totalProductos)
    res.json({ ok: true, status: 200, totalProductos: totalProductos })
  }


};
