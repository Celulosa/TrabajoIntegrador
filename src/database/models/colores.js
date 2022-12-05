function productoData(sequelize, Datatypes){

alias = 'colores';

cols ={
    id: {type: Datatypes.INTEGER, primaryKey: true, autoIncrement: true},
    nombre:{type: Datatypes.STRING(30)},
}

config = {camelCase: false, timestamps: false}; 
const colores = sequelize.define(alias,cols,config)

colores.associate = function (modelos){

    colores.hasMany(modelos.productos, {   
      as: "productos",
      foreignKey: "color_id"
    });
}

return colores;
}
module.exports = productoData;