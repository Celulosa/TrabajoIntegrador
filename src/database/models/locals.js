function localsData(sequelize, Datatypes){

    alias = 'locals';
    
    cols ={
        id: {type: Datatypes.INTEGER, primaryKey: true, autoIncrement: true},
        nombre:{type: Datatypes.STRING(30)},

    }
    
    config = {camelCase: false, timestamps: false}; 
    
    const locals = sequelize.define(alias,cols,config)

    locals.associate = function (models){

        locals.hasMany(models.users, {   
          as: "users",
          foreignKey: "local_id"
        });
   
    }
    return locals;
    
    }
    
    module.exports = localsData;