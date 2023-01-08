function detalle_ventas(sequelize, Datatypes) {

    alias = 'detalle_ventas';

    cols = {
        id: { type: Datatypes.INTEGER, primaryKey: true, autoIncrement: true },
        nombre: {type: Datatypes.STRING(25)},
        precio: { type: Datatypes.DECIMAL(10, 2) },
        quantity: {type: Datatypes.INTEGER(11)},
        producto_id:{type: Datatypes.INTEGER(11)},
        createdAt: { type: Datatypes.DATE },
        updatedAt: { type: Datatypes.DATE },
        ventaId:{type: Datatypes.INTEGER(11)},

        ventasId:{type: Datatypes.INTEGER(11)},
        ProductosId:{type: Datatypes.INTEGER(11)},
       

    }

    config = { camelCase: false, timestamps: true };

    const detalle_ventas = sequelize.define(alias, cols, config);

    detalle_ventas.associate = function (models) {

        /**/
// la asociacion de abajo viene del video del profesor que muestra el carrito
detalle_ventas.belongsTo(models.ventas, {   
    as: "ventas",
   // foreignKey: "detalle_venta_id"
  });


detalle_ventas.belongsTo(models.productos, {   
            as: "productos",
           // foreignKey: "detalle_venta_id"
          });




    }
    return detalle_ventas;
}

module.exports = detalle_ventas;