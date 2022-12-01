function productoData(sequelize, Datatypes){

alias = 'productos';

cols ={
    id: {type: Datatypes.INTEGER, primaryKey: true, autoIncrement: true},
    nombre:{type: Datatypes.STRING(30)},
    precio:{type: Datatypes.DECIMAL(30)},
    descripcion:{type: Datatypes.STRING(100)},
    fecha_creacion:{type: Datatypes.DATE},
    imagen:{type: Datatypes.STRING(45)},
    admin_id:{type: Datatypes.INTEGER},
    categoria_id:{type: Datatypes.INTEGER},
    talle_id:{type: Datatypes.INTEGER},
    color_id:{type: Datatypes.INTEGER},
    temporada_id:{type: Datatypes.INTEGER},
}

config = {camelCase: false, timestamps: false}; 
const productos = sequelize.define(alias,cols,config)

productos.associate = function (modelos){

    productos.belongsTo(modelos.categorias, {   
      as: "categorias",
      foreignKey: "categoria_id"
    });
  
    productos.belongsTo(modelos.talles, {   
        as: "talles",
        foreignKey: "talle_id"
      });

      productos.belongsTo(modelos.colores, {   
        as: "colores",
        foreignKey: "color_id"
      });

      productos.belongsTo(modelos.temporadas, {   
        as: "temporadas",
        foreignKey: "temporada_id"
      });

      productos.belongsTo(modelos.users, {   
        as: "users",
        foreignKey: "admin_id"
      });

      productos.hasMany(modelos.ventas, {   
        as: "ventas",
        foreignKey: "producto_id"
      });



      
  }

return productos;
}
module.exports = productoData;