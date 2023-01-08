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

productos.associate = function (models){

   productos.belongsTo(models.users, {   
        as: "productos",
        foreignKey: "admin_id"
      });
    productos.belongsTo(models.categorias, {   
      as: "categorias",
      foreignKey: "categoria_id"
    });
  
    productos.belongsTo(models.talles, {   
        as: "talles",
        foreignKey: "talle_id"
      });

      productos.belongsTo(models.colores, {   
        as: "colores",
        foreignKey: "color_id"
      });

      productos.belongsTo(models.temporadas, {   
        as: "temporadas",
        foreignKey: "temporada_id"
      }); 
      productos.hasMany(models.ventas, {   
        as: "ventas",
        foreignKey: "producto_id"
      });
  }

return productos;
}
module.exports = productoData;