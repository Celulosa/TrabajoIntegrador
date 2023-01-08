function usuarios(sequelize, Datatypes){

  alias = 'users';
  
  cols ={
      id: {type: Datatypes.INTEGER, primaryKey: true, autoIncrement: true},
      nombre:{type: Datatypes.STRING(30)},
      apellido:{type: Datatypes.STRING(30)},
      email:{type: Datatypes.STRING(45)},
      cumpleanos: {type: Datatypes.DATE},
      direccion:{type: Datatypes.STRING(45)},
      contrasena:{type: Datatypes.STRING(100)},
      avatar:{type: Datatypes.STRING(100)},
      tipoUsuario:{type: Datatypes.ENUM('super','admin','general')},
      borrar:{type: Datatypes.TINYINT(1)},
      local_id:{type: Datatypes.INTEGER},
      createdAt: { type: Datatypes.DATE },
      updatedAt: { type: Datatypes.DATE },
  }
  
  config = {camelCase: false, timestamps: true}; 
  
  const users = sequelize.define(alias,cols,config);
  
  users.associate = function (models){
  
      users.belongsTo(models.locals, {   
        as: "locals",
        foreignKey: "local_id"
      });
      users.hasMany(models.ventas, {   
        as: "ventas",
        //foreignKey: "usuario_id"
      });
  
      users.hasMany(models.productos, {   
        as: "productos",
        foreignKey: "admin_id"
      });
  
    }
  return users;
  
  }
  
  module.exports = usuarios;