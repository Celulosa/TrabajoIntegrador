function usersData(sequelize, Datatypes){

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
    local_id:{type: Datatypes.INTEGER},
}

config = {camelCase: false, timestamps: false}; 

const users = sequelize.define(alias,cols,config);

users.associate = function (models){

    users.belongsTo(models.locals, {   
      as: "locals",
      foreignKey: "local_id"
    });
    users.hasMany(models.ventas, {   
      as: "ventas",
      foreignKey: "usuario_id"
    });

    users.hasMany(models.productos, {   
      as: "productos",
      foreignKey: "admin_id"
    });


}
return users;
}

module.exports = usersData;