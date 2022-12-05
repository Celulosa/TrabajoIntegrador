function productoData(sequelize, Datatypes){

alias = 'categorias';

cols ={
    id: {type: Datatypes.INTEGER, primaryKey: true, autoIncrement: true},
    nombre:{type: Datatypes.STRING(30)},
}

config = {camelCase: false, timestamps: false}; 
const categorias = sequelize.define(alias,cols,config)

categorias.associate = function (modelos){

    categorias.hasMany(modelos.productos, {   
      as: "productos",
      foreignKey: "categoria_id"
    });
}

return categorias;
}
module.exports = productoData;