function productoData(sequelize, Datatypes){

alias = 'talles';

cols ={
    id: {type: Datatypes.INTEGER, primaryKey: true, autoIncrement: true},
    medida:{type: Datatypes.STRING(30)},
}

config = {camelCase: false, timestamps: false}; 
const talles = sequelize.define(alias,cols,config)

talles.associate = function (modelos){

    talles.hasMany(modelos.productos, {   
      as: "productos",
      foreignKey: "talle_id"
    });
}

return talles;
}
module.exports = productoData;