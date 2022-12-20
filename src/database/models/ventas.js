function usersData(sequelize, Datatypes) {

    alias = 'ventas';

    cols = {
        id: { type: Datatypes.INTEGER, primaryKey: true, autoIncrement: true },
        monto_unitario: { type: Datatypes.DECIMAL(30) },
        cantidad: { type: Datatypes.INTEGER(30) },
        direccion_envio: { type: Datatypes.STRING(45) },
        detalle_venta_id: { type: Datatypes.INTEGER(11) },
        usuario_id: { type: Datatypes.INTEGER(11) },
        producto_id: { type: Datatypes.INTEGER(11) },

    }

    config = { camelCase: false, timestamps: false };

    const ventas = sequelize.define(alias, cols, config);

    ventas.associate = function (models) {

        ventas.belongsTo(models.users, {
            as: "users",
            foreignKey: "usuario_id"
        });
        ventas.belongsTo(models.productos, {
            as: "productos",
            foreignKey: "producto_id"
        });
    }
    return ventas;
}

module.exports = usersData;