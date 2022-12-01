function productoData(sequelize, Datatypes){

alias = 'temporadas';

cols ={
    id: {type: Datatypes.INTEGER, primaryKey: true, autoIncrement: true},
    nombre:{type: Datatypes.STRING(30)},
}

config = {camelCase: false, timestamps: false}; 
const temporadas = sequelize.define(alias,cols,config)

temporadas.associate = function (modelos){

    temporadas.hasMany(modelos.productos, {   
      as: "productos",
      foreignKey: "temporada_id"
    });
}

return temporadas;
}
module.exports = productoData;