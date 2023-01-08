function ventas(sequelize, Datatypes) {

    alias = 'ventas';

    cols = {
        id: { type: Datatypes.INTEGER, primaryKey: true, autoIncrement: true },
        total: { type: Datatypes.DECIMAL(30) },
        quantity: { type: Datatypes.INTEGER(30) },
        direccion: { type: Datatypes.STRING(45) },
        detalleVentaId: { type: Datatypes.INTEGER(11) },
        usuario_id: { type: Datatypes.INTEGER(11) },
        userId: { type: Datatypes.INTEGER(11) },
        producto_id: { type: Datatypes.INTEGER(11) },
        paymentMethod: {
            type: Datatypes.STRING(25),
            allowNull: false,
        },
        createdAt: { type: Datatypes.DATE },
        updatedAt: { type: Datatypes.DATE },


    }

    config = { camelCase: false, timestamps: true };

    const ventas = sequelize.define(alias, cols, config);

    ventas.associate = function (models) {

        ventas.belongsTo(models.users, {
            as: "users",
            foreignKey: "usuario_id"
        });
        /*ventas.belongsTo(models.productos, {
            as: "productos",
            foreignKey: "producto_id"
        });*/

        ventas.OrderItems = ventas.hasMany(models.detalle_ventas, {
            as: "orderItems",

        });
    }
    return ventas;
}

module.exports = ventas;