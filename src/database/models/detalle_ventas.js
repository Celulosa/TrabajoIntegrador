function usersData(sequelize, Datatypes) {

    alias = 'detalle_ventas';

    cols = {
        id: { type: Datatypes.INTEGER, primaryKey: true, autoIncrement: true },
        monto_total: { type: Datatypes.DECIMAL(30) },
        fecha: { type: Datatypes.DATE },
        
    }

    config = { camelCase: false, timestamps: false };

    const detalle_ventas = sequelize.define(alias, cols, config);

    detalle_ventas.associate = function (models) {

        detalle_ventas.hasMany(models.ventas, {   
            as: "ventas",
            foreignKey: "detalle_venta_id"
          });

    }
    return detalle_ventas;
}

module.exports = usersData;